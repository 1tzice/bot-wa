import db from '../lib/database.js'
import { asahotak } from '@bochilteam/scraper'

let timeout = 120000
let poin = 1999
let handler = async (m, { conn, usedPrefix, isPrems }) => {
	let chat = db.data.chats[m.chat]
	if (!chat.game && m.isGroup) return
	conn.asahotak = conn.asahotak ? conn.asahotak : {}
	let id = m.chat
	if (id in conn.asahotak) {
		conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.asahotak[id][0])
		throw false
	}
	if (db.data.users[m.sender].limit < 1 && db.data.users[m.sender].money > 50000 && !isPrems) throw `Beli limit dulu lah, duid lu banyak kan 😏`
	else if (db.data.users[m.sender].limit > 0 && !isPrems) db.data.users[m.sender].limit -= 1
	const json = await asahotak()
	let caption = `
🎮 *Asah Otak* 🎮

${json.soal}

⭔ Timeout *${(timeout / 1000).toFixed(2)} detik*
⭔ Bonus: ${poin} Exp
`.trim()
	conn.asahotak[id] = [
		await conn.reply(m.chat, caption, m),
		json, poin,
		setTimeout(() => {
			if (conn.asahotak[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, pauthor, ['asahotak', `${usedPrefix}asahotak`], conn.asahotak[id][0])
			delete conn.asahotak[id]
		}, timeout)
	]
	console.log(json.jawaban)
}

handler.menufun = ['asahotak (exp+)']
handler.tagsfun = ['game']
handler.command = /^(asahotak)$/i

handler.premium = true

export default handler