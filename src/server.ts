import 'dotenv/config'
import { app } from './app'
import { AppDataSource } from './shared/database/data-source'

const PORT = process.env.PORT || 3333

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize()

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  } catch (error: unknown) {
    console.error('Falha ao inicializar a conexão com o banco de dados.', error)
    process.exit(1)
  }
}

void startServer()
