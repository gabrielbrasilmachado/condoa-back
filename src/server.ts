import 'dotenv/config'
import { app } from './app'
import { AppDataSource } from './shared/database/data-source'

const PORT = Number(process.env.PORT || 3333)
const HOST = process.env.HOST || '0.0.0.0'

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize()

    app.listen(PORT, HOST, () => {
      console.log(`Servidor rodando em ${HOST}:${PORT}`)
    })
  } catch (error: unknown) {
    console.error('Falha ao inicializar a conexão com o banco de dados.', error)
    process.exit(1)
  }
}

void startServer()
