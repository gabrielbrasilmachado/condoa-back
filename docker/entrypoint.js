#!/usr/bin/env node

/**
 * Entrypoint script executado ao iniciar o Docker
 * 1. Sincroniza dependencias do projeto
 * 2. Aguarda PostgreSQL estar pronto
 * 3. Aguarda MinIO estar pronto
 * 4. Garante bucket publico de imagens
 * 5. Roda migrations
 * 6. Roda seed inicial
 * 7. Inicia a aplicacao
 */

const { spawn } = require('child_process')
const { Client: PgClient } = require('pg')
const { Client: MinioClient } = require('minio')

async function installDependencies() {
  console.log('Sincronizando dependencias do projeto...')

  return new Promise((resolve, reject) => {
    const install = spawn('yarn', ['install', '--immutable'], {
      stdio: 'inherit',
      shell: true,
    })

    install.on('close', (code) => {
      if (code === 0) {
        console.log('Dependencias sincronizadas com sucesso!')
        resolve()
      } else {
        console.error('Erro ao sincronizar dependencias')
        reject(new Error(`Install failed with code ${code}`))
      }
    })

    install.on('error', (err) => {
      console.error('Erro ao instalar dependencias:', err)
      reject(err)
    })
  })
}

async function waitForDatabase() {
  console.log('Aguardando PostgreSQL...')

  const maxAttempts = 30
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const client = new PgClient({
        host: process.env.DB_HOST || 'db',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'condoa',
      })

      await client.connect()
      await client.end()

      console.log('PostgreSQL esta pronto!')
      return true
    } catch {
      attempts++

      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  console.error('PostgreSQL nao respondeu apos 30 segundos')
  process.exit(1)
}

function createMinioClient() {
  return new MinioClient({
    endPoint: process.env.MINIO_HOST || 'minio',
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: String(process.env.MINIO_USE_SSL || 'false').toLowerCase() === 'true',
    accessKey: process.env.MINIO_USERNAME || 'minioadmin',
    secretKey: process.env.MINIO_PASSWORD || 'minioadmin',
  })
}

async function waitForMinio() {
  console.log('Aguardando MinIO...')

  const client = createMinioClient()
  const bucket = process.env.MINIO_BUCKET || 'uploads'
  const maxAttempts = 30
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      await client.bucketExists(bucket)
      console.log('MinIO esta pronto!')
      return true
    } catch {
      attempts++

      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  console.error('MinIO nao respondeu apos 30 segundos')
  process.exit(1)
}

async function configurePublicBucket() {
  console.log('Configurando bucket publico de imagens...')

  const client = createMinioClient()
  const bucket = process.env.MINIO_BUCKET || 'uploads'

  const bucketExists = await client.bucketExists(bucket)

  if (!bucketExists) {
    await client.makeBucket(bucket)
  }

  const publicReadPolicy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          AWS: ['*'],
        },
        Action: ['s3:GetBucketLocation', 's3:ListBucket'],
        Resource: [`arn:aws:s3:::${bucket}`],
      },
      {
        Effect: 'Allow',
        Principal: {
          AWS: ['*'],
        },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  })

  await client.setBucketPolicy(bucket, publicReadPolicy)

  console.log('Bucket configurado para leitura publica.')
}

async function runMigrations() {
  console.log('Executando migrations...')

  return new Promise((resolve, reject) => {
    const migration = spawn('yarn', ['migration:run'], {
      stdio: 'inherit',
      shell: true,
    })

    migration.on('close', (code) => {
      if (code === 0) {
        console.log('Migrations executadas com sucesso!')
        resolve()
      } else {
        console.error('Erro ao executar migrations')
        reject(new Error(`Migration failed with code ${code}`))
      }
    })

    migration.on('error', (err) => {
      console.error('Erro ao rodar migrations:', err)
      reject(err)
    })
  })
}

async function runSeed() {
  console.log('Executando seed inicial...')

  return new Promise((resolve, reject) => {
    const seed = spawn('yarn', ['seed:admin'], {
      stdio: 'inherit',
      shell: true,
    })

    seed.on('close', (code) => {
      if (code === 0) {
        console.log('Seed inicial executado com sucesso!')
        resolve()
      } else {
        console.error('Erro ao executar seed inicial')
        reject(new Error(`Seed failed with code ${code}`))
      }
    })

    seed.on('error', (err) => {
      console.error('Erro ao rodar seed inicial:', err)
      reject(err)
    })
  })
}

async function startApplication() {
  console.log('Iniciando aplicacao...')

  const app = spawn('yarn', ['dev'], {
    stdio: 'inherit',
    shell: true,
  })

  app.on('error', (err) => {
    console.error('Erro ao iniciar aplicacao:', err)
    process.exit(1)
  })

  const stopApplication = () => {
    console.log('\nEncerrando aplicacao...')
    app.kill()
    process.exit(0)
  }

  process.on('SIGINT', stopApplication)
  process.on('SIGTERM', stopApplication)
}

async function main() {
  try {
    await installDependencies()
    await waitForDatabase()
    await waitForMinio()
    await configurePublicBucket()
    await runMigrations()
    await runSeed()
    await startApplication()
  } catch (error) {
    console.error('Erro no entrypoint:', error)
    process.exit(1)
  }
}

main()
