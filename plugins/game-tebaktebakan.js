import db from '../lib/database.js'
import { tebaktebakan } from '@bochilteam/scraper'

let timeout = 120000
let poin = 3499
let handler = async (m, { conn, usedPrefix, isPrems }) => {
	let chat = db.data.chats[m.chat]
	if (!chat.game && m.isGroup) return
	conn.tebaktebakan = conn.tebaktebakan ? conn.tebaktebakan : {}
	let id = m.chat
	if (id in conn.tebaktebakan) {
		conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaktebakan[id][0])
		throw false
	}
	if (db.data.users[m.sender].limit < 1 && db.data.users[m.sender].money > 50000 && !isPrems) throw `Beli limit dulu lah, duid lu banyak kan 😏`
	else if (db.data.users[m.sender].limit > 0 && !isPrems) db.data.users[m.sender].limit -= 1
	const json = await tebaktebakan()
	let caption = `
🎮 *Tebak-tebakan* 🎮

${json.soal}

⭔ Timeout *${(timeout / 1000).toFixed(2)} detik*
⭔ Bonus: ${poin} Money
`.trim()
	conn.tebaktebakan[id] = [
		await conn.reply(m.chat, caption, m),
		json, poin,
		setTimeout(() => {
			if (conn.tebaktebakan[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, pauthor, ['tebaktebakan', `${usedPrefix}tebaktebakan`], conn.tebaktebakan[id][0])
			delete conn.tebaktebakan[id]
		}, timeout)
	]
	console.log(json.jawaban)
}

handler.menufun = ['tebaktebakan (money+)']
handler.tagsfun = ['game']
handler.command = /^(tebaktebakan)$/i

handler.premium = true

export default handler