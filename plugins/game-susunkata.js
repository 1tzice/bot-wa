import db from '../lib/database.js'
import { susunkata } from '@bochilteam/scraper'

let timeout = 120000
let poin = 3499
let handler = async (m, { conn, usedPrefix, isPrems }) => {
	let chat = db.data.chats[m.chat]
	if (!chat.game && m.isGroup) return
	conn.susunkata = conn.susunkata ? conn.susunkata : {}
	let id = m.chat
	if (id in conn.susunkata) {
		conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.susunkata[id][0])
		throw false
	}
	if (db.data.users[m.sender].limit < 1 && db.data.users[m.sender].money > 50000 && !isPrems) throw `Beli limit dulu lah, duid lu banyak kan 😏`
	else if (db.data.users[m.sender].limit > 0 && !isPrems) db.data.users[m.sender].limit -= 1
	const json = await susunkata()
	let caption = `
🎮 *Susun Kata* 🎮

Soal : ${json.soal}
Tipe : ${json.tipe}

⭔ Timeout *${(timeout / 1000).toFixed(2)} detik*
⭔ Bonus: ${poin} Money
`.trim()
	conn.susunkata[id] = [
		await conn.reply(m.chat, caption, m),
		json, poin,
		setTimeout(() => {
			if (conn.susunkata[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, pauthor, ['susunkata', `${usedPrefix}susunkata`], conn.susunkata[id][0])
			delete conn.susunkata[id]
		}, timeout)
	]
	console.log(json.jawaban)
}

handler.menufun = ['susunkata (money+)']
handler.tagsfun = ['game']
handler.command = /^(susunkata)$/i

handler.premium = true

export default handler