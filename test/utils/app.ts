import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { configureAppGlobals } from '@/app'

export const createTestApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .compile()

  const app = moduleFixture.createNestApplication()

  configureAppGlobals(app)

  await app.init()

  return app
}
