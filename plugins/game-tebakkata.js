import db from '../lib/database.js'
import { tebakkata } from '@bochilteam/scraper'

let timeout = 120000
let poin = 3499
let handler = async (m, { conn, usedPrefix, isPrems }) => {
	let chat = db.data.chats[m.chat]
	if (!chat.game && m.isGroup) return
	conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
	let id = m.chat
	if (id in conn.tebakkata) {
		conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkata[id][0])
		throw false
	}
	if (db.data.users[m.sender].limit < 1 && db.data.users[m.sender].money > 50000 && !isPrems) throw `Beli limit dulu lah, duid lu banyak kan 😏`
	else if (db.data.users[m.sender].limit > 0 && !isPrems) db.data.users[m.sender].limit -= 1
	const json = await tebakkata()
	let caption = `
🎮 *Tebak Kata* 🎮

${json.soal}

⭔ Timeout *${(timeout / 1000).toFixed(2)} detik*
⭔ Bonus: ${poin} Money
`.trim()
	conn.tebakkata[id] = [
		await conn.reply(m.chat, caption, m),
		json, poin,
		setTimeout(() => {
			if (conn.tebakkata[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, pauthor, ['tebakkata', `${usedPrefix}tebakkata`], conn.tebakkata[id][0])
			delete conn.tebakkata[id]
		}, timeout)
	]
	console.log(json.jawaban)
}

handler.menufun = ['tebakkata (money+)']
handler.tagsfun = ['game']
handler.command = /^(tebakkata)$/i

handler.premium = true

export default handler