const { Telegraf, Markup, Composer, Scenes, session } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);


const startWizard = new Composer()
startWizard.on('text', async (ctx) => {
    await ctx.reply('Say your name:')
    return ctx.wizard.next()
})

const firstName = new Composer()
firstName.on('text', async (ctx) =>  {
    await ctx.reply('Say your lastname:')
    return ctx.wizard.next()
})

const lastName = new Composer()
lastName.on('text', async (ctx) => {
    await ctx.reply('Choose', Markup.inlineKeyboard([
        [Markup.button.callback('Telegram', 'telegram')],
        [Markup.button.callback('WatsApp', 'watsapp')],
    ]))
    return ctx.wizard.next()
})

const messenger = new Composer()
messenger.action('telegram', async (ctx) => {
    await ctx.reply('Nice!')
    return ctx.scene.leave()
})
messenger.action('watsapp', async ctx => {
    await ctx.reply('fuck off!')
    return ctx.scene.leave()
})


const menuScene = new Scenes.WizardScene('sceneWizard', startWizard, firstName, lastName, messenger)

const stage = new Scenes.Stage([menuScene])
bot.use(session())
bot.use(stage.middleware())

bot.command('start', (ctx) => ctx.scene.enter('sceneWizard'))


// bot.start(async (ctx) => {
//     ctx.reply('hoho');
// })


bot.launch()
    .then(res => console.log('Bot started!'))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))