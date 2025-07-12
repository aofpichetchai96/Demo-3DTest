import { seedModelConfigurations } from './modelConfigService'

async function runSeed() {
  try {
    console.log('🌱 Starting model configurations seed...')
    const result = await seedModelConfigurations()
    console.log(`✅ Seeded ${result.length} model configurations`)
    console.log('Models:', result.map(config => config.modelName).join(', '))
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

runSeed()
