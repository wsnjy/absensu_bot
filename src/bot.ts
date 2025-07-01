import axios from 'axios';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';

dotenv.config();

export class LinkAjaReminderBot {
  private token: string;
  private chatId: string;
  private baseUrl: string;

  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;

    if (!this.token || !this.chatId) {
      throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    }

    console.log('🤖 Bot initialized successfully');
    console.log(`📱 Chat ID: ${this.chatId}`);
  }

  // Clock IN Motivational Quotes
  private readonly clockInQuotes = [
    "💫 <i>Setiap pagi adalah kesempatan baru untuk menjadi versi terbaik dari diri kita</i>",
    "🌟 <i>Kesuksesan dimulai dari langkah pertama yang berani</i>",
    "🚀 <i>Hari ini adalah hari yang sempurna untuk memulai sesuatu yang luar biasa</i>",
    "⭐ <i>Mimpi tidak akan berubah menjadi kenyataan jika kita hanya tidur</i>",
    "🔥 <i>Kerja keras hari ini, santai besok dengan bangga</i>",
    "💪 <i>Jangan menunggu motivasi datang, ciptakan momentum sendiri</i>",
    "🌈 <i>Setiap tantangan adalah kesempatan untuk berkembang</i>",
    "⚡ <i>Produktivitas adalah hasil dari konsistensi, bukan perfeksi</i>",
    "🎯 <i>Focus on progress, not perfection</i>",
    "🌅 <i>Morning energy sets the tone for the entire day</i>",
    "🏆 <i>Winners don't wait for motivation, they create it</i>",
    "💎 <i>Pressure makes diamonds, embrace the challenge</i>",
    "🌱 <i>Growth happens outside your comfort zone</i>",
    "🔥 <i>Be the energy you want to attract</i>",
    "⚡ <i>Small steps daily lead to big changes yearly</i>",
    "🌟 <i>Your only limit is your mind</i>",
    "💪 <i>Difficult roads often lead to beautiful destinations</i>",
    "🚀 <i>Today's efforts are tomorrow's results</i>",
    "⭐ <i>Excellence is not a skill, it's an attitude</i>",
    "🎯 <i>Make today so awesome that yesterday gets jealous</i>"
  ];

  // Clock OUT Inspirational Quotes
  private readonly clockOutQuotes = [
    "🌙 <i>Istirahat yang cukup adalah investasi untuk produktivitas besok</i>",
    "🏠 <i>Work hard, rest harder - balance is the key to happiness</i>",
    "😌 <i>Hari yang produktif berakhir dengan hati yang tenang</i>",
    "🍃 <i>Disconnect to reconnect with what truly matters</i>",
    "🌸 <i>Self-care isn't selfish, it's essential</i>",
    "🎭 <i>Life is about balance: work, rest, and everything in between</i>",
    "🌅 <i>Today's work is done, tomorrow's possibilities are endless</i>",
    "🏆 <i>Celebrate small wins, they add up to big victories</i>",
    "💆‍♀️ <i>Recharge your soul, tomorrow needs your best version</i>",
    "🍃 <i>Peace begins with logging out from work mode</i>",
    "🌟 <i>You've earned this rest, enjoy every moment</i>",
    "🎯 <i>Success is measured by how well you rest, not just work</i>",
    "🌙 <i>Sleep is the golden chain that ties health and our bodies together</i>",
    "😴 <i>Rest when you're weary, refresh and renew yourself</i>",
    "🏡 <i>Home is where productivity ends and peace begins</i>",
    "🌈 <i>Every sunset brings the promise of a new dawn</i>",
    "💤 <i>Quality sleep = Quality life</i>",
    "🌸 <i>Take time to make your soul happy</i>",
    "🎭 <i>Work-life balance isn't a myth, it's a necessity</i>",
    "⭐ <i>Rest is not a reward for work completed, but a requirement for work excellence</i>"
  ];

  // Fun/Humor Quotes (Alternative)
  private readonly funQuotes = [
    "😄 <i>Coffee: because anger management is too expensive</i>",
    "🤪 <i>I'm not lazy, I'm on energy saving mode</i>",
    "😂 <i>Work mode: activated! (battery level may vary)</i>",
    "🦾 <i>Powered by caffeine and good vibes</i>",
    "🎪 <i>Life's a circus, but at least we're the performers</i>",
    "🤖 <i>Beep beep! Productivity bot activated</i>",
    "🎮 <i>Real life loading... please wait</i>",
    "🍕 <i>Fueled by dreams and occasional pizza</i>",
    "🦸‍♀️ <i>Not all heroes wear capes, some just clock in on time</i>",
    "🎯 <i>Adulting level: barely functional but still trying</i>"
  ];

  // Indonesian Wisdom Quotes
  private readonly indonesianQuotes = [
    "🌾 <i>Sedikit demi sedikit, lama-lama menjadi bukit</i>",
    "🦅 <i>Berani karena benar, takut karena salah</i>",
    "🌱 <i>Tumbuh bersama, berkembang bersama</i>",
    "⚡ <i>Gantungkan cita-cita setinggi langit</i>",
    "🏔️ <i>Gunung tidak akan bertemu gunung, tapi manusia bisa bertemu manusia</i>",
    "🌊 <i>Air beriak tanda tak dalam</i>",
    "🍯 <i>Rezeki tidak akan tertukar</i>",
    "🦋 <i>Dimana bumi dipijak, disitu langit dijunjung</i>",
    "🌺 <i>Sekali merengkuh dayung, dua tiga pulau terlampaui</i>",
    "⭐ <i>Berat sama dipikul, ringan sama dijinjing</i>"
  ];

  // Get random quote from array
  private getRandomQuote(quotes: string[]): string {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Get Jakarta time
  private getJakartaTime() {
    return DateTime.now().setZone('Asia/Jakarta');
  }

  // Check if weekday
  private isWeekday(): boolean {
    const now = this.getJakartaTime();
    return now.weekday <= 5; // 1=Monday, 7=Sunday
  }

  // Send message to Telegram
  private async sendMessage(message: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      });

      if (response.data.ok) {
        console.log('✅ Message sent successfully!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      return false;
    }
  }

  // Fetch quote from external API (optional)
  private async getExternalQuote(): Promise<string> {
    try {
      // Option 1: quotable.io - English quotes
      const response = await axios.get('https://api.quotable.io/random?tags=motivational,inspirational', {
        timeout: 5000
      });
      return `💭 <i>"${response.data.content}" - ${response.data.author}</i>`;
    } catch (error) {
      // Fallback to local quotes if API fails
      console.log('📡 External API failed, using local quotes');
      return this.getRandomQuote(this.clockInQuotes);
    }
  }

  // Clock IN reminder
  async clockInReminder(): Promise<boolean> {
    if (!this.isWeekday()) {
      console.log('🏖️ Weekend - skipping reminder');
      return true;
    }

    const now = this.getJakartaTime();
    const dateStr = now.setLocale('id').toFormat('cccc, dd MMMM yyyy');
    
    // Get random motivational quote
    const randomQuote = this.getRandomQuote(this.clockInQuotes);
    
    // Alternative: use external API quote (uncomment if you want)
    // const randomQuote = await this.getExternalQuote();

    const message = `🌅 <b>SELAMAT PAGI SOBAT NGANTEMI TEAM!</b>

⏰ <b>CLOCK IN REMINDER 08:00 WIB</b>

📱 <b>Jangan lupa clock in ${dateStr} masuk di Sunfish!</b>

${randomQuote}`;

    return await this.sendMessage(message);
  }

  // Clock OUT reminder
  async clockOutReminder(): Promise<boolean> {
    if (!this.isWeekday()) {
      console.log('🏖️ Weekend - skipping reminder');
      return true;
    }

    const now = this.getJakartaTime();
    const dateStr = now.setLocale('id').toFormat('cccc, dd MMMM yyyy');
    
    // Get random rest/balance quote
    const randomQuote = this.getRandomQuote(this.clockOutQuotes);

    const message = `🌆 <b>WAKTUNYA TUTUP LAPTOP SOBAT NGANTEMI TEAM!</b>

⏰ <b>CLOCK OUT REMINDER 17:00 WIB</b>

📱 <b>Jangan lupa Clock OUT ${dateStr} di Sunfish!</b>

${randomQuote}`;

    return await this.sendMessage(message);
  }

  // Test connection with different quote types
  async testBot(): Promise<boolean> {
    const now = this.getJakartaTime();
    
    // Randomly choose quote type for testing
    const quoteTypes = [
      this.clockInQuotes,
      this.clockOutQuotes,
      this.funQuotes,
      this.indonesianQuotes
    ];
    
    const randomQuoteType = quoteTypes[Math.floor(Math.random() * quoteTypes.length)];
    const randomQuote = this.getRandomQuote(randomQuoteType);

    const message = `🧪 <b>TEST MESSAGE</b>

✅ Bot berhasil terhubung!
🕰️ Jakarta Time: ${now.toFormat('HH:mm:ss')} WIB
📅 ${now.setLocale('id').toFormat('cccc, dd MMMM yyyy')}

⏰ <b>CLOCK IN REMINDER</b>
🕰️ 08:00 WIB

📱 <b>Jangan lupa clock in ${now.setLocale('id').toFormat('cccc, dd MMMM yyyy')} masuk di Sunfish yo gaskan!</b>
💼 Semangat kerja hari ini! 🚀

${randomQuote}`;

    return await this.sendMessage(message);
  }

  // Special methods for different quote types (bonus features)
  async sendMotivationalQuote(): Promise<boolean> {
    const quote = this.getRandomQuote(this.clockInQuotes);
    const message = `✨ <b>MOTIVATIONAL BOOST</b>

${quote}

<i>🤖 Your friendly motivation bot</i>`;
    
    return await this.sendMessage(message);
  }

  async sendFunQuote(): Promise<boolean> {
    const quote = this.getRandomQuote(this.funQuotes);
    const message = `😄 <b>DAILY HUMOR</b>

${quote}

<i>🎭 Laughter is the best medicine!</i>`;
    
    return await this.sendMessage(message);
  }

  async sendWisdomQuote(): Promise<boolean> {
    const quote = this.getRandomQuote(this.indonesianQuotes);
    const message = `🌾 <b>WISDOM OF THE DAY</b>

${quote}

<i>🇮🇩 Kearifan Nusantara</i>`;
    
    return await this.sendMessage(message);
  }
}

// Export untuk testing individual quote types
export const QuoteTypes = {
  MOTIVATIONAL: 'motivational',
  HUMOR: 'humor', 
  WISDOM: 'wisdom',
  EXTERNAL: 'external'
} as const;