import { LinkAjaReminderBot } from './bot';

async function main() {
  try {
    const bot = new LinkAjaReminderBot();
    const command = process.argv[2]; // Get command from arguments

    console.log(`🚀 Running command: ${command}`);

    let success = false;

    switch (command) {
      case 'clock_in':
        success = await bot.clockInReminder();
        break;
      case 'clock_out':
        success = await bot.clockOutReminder();
        break;
      case 'test':
        success = await bot.testBot();
        break;
        case 'motivational':
        success = await bot.sendMotivationalQuote();
        break;
      case 'humor':
        success = await bot.sendFunQuote();
        break;
      case 'wisdom':
        success = await bot.sendWisdomQuote();
        break;
      default:
        console.error('❌ Invalid command. Use: clock_in, clock_out, or test');
        process.exit(1);
    }

    if (success) {
      console.log('✅ Command completed successfully!');
    } else {
      console.error('❌ Command failed!');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();