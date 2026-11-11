// ============================================================
// telegram-bot — Kerry Topup (ETAP 2)
// Menu, pwodwi, ID + PIN, balans, kòmand, tèks lib (IA), achte, moun reyèl.
// Secrets: TELEGRAM_BOT_TOKEN, GROQ_API_KEY. Verify JWT = OFF.
// ============================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE = 'https://kerrytopup.com';
const PER_PAGE = 20;
const WA_LINK = 'https://wa.me/50938347487?text=bonjour%20kerry';
const MAX_PIN_FAIL = 5;
const LOCK_MIN = 15;

/* ------------------------------ tèks (4 lang) ------------------------------ */
const T = {
  ht: {
    hello: '👋 Bonjou, byenvini nan <b>Kerry Topup</b>!\nEkri sa w bezwen, oswa chwazi yon bouton:',
    welcome: '👋🏽 <b>BONJOU / BONSWÈ</b> 👋🏽\n\n💚 <b>BYENVENI LAKAY KERRY TOPUP OFFICIAL!</b> 💎🔥\n\nNou kontan anpil dèske ou kontakte nou. 🙏🏽\nKerry Topup se la pou rann top-up ak sèvis dijital ou yo pi fasil, pi rapid epi pi pratik. ⚡\n\n🎮 <b>Men kèk nan sèvis nou yo :</b>\n1️⃣ Free Fire Diamonds 💎\n2️⃣ recharge Wise &amp; Meru\n3️⃣ Top-up E-Football ⚽\n4️⃣ Recharge PayPal 💰\n5️⃣ Blood Strike 🎯\n6️⃣ Flex City 🎮\n➕ Plizyè lòt sèvis k ap vini...\n\n📢 Pou jwenn plis enfòmasyon, promosyon ak nouveautés : https://chat.whatsapp.com/LW3tSzIAznP8Zf1LJl1WlE\n\n👉🏽 Rejoignez notre communauté WhatsApp\n\n' +
      '📲 Channel Kerry Topup : https://whatsapp.com/channel/0029Vb7SDqG1NCrMyxNOGo3Z\n\n👉🏽 Suivez-nous pou pa rate okenn promo 🔥\n\n🌐 Vizite boutique nou an :\n👉🏽 KerryTopup.com\n\n📩 Support :\n👉🏽 kerrytopup54@gmail.com\n\n💚 <b>KERRY TOPUP OFFICIAL</b>\n⚡ Rapid • 🔐 Sécurisé • 🤝 Fiable\n\n🙏🏽 Mèsi pou konfyans ou, epi ankò yon fwa: BYENVENI NAN FANMI KERRY TOPUP! 💚💎🚀',
    connBtn: '🔑 Konekte',
    outBtn: '🚪 Dekonekte',
    outDone: '🚪 <b>Ou dekonekte.</b>\nM bliye kont lan sou telefòn sa a.\n\nPou w konekte ankò, voye <b>ID kont ou</b> (8 chif).',
    hello_named: '👋 Bonjou <b>{n}</b>! Kisa m ka fè pou ou?',
    products: '🛍️ Pwodwi',
    balance: '💰 Balans',
    orders: '📦 Kòmand mwen',
    recharge: '➕ Rechaj',
    help: '🆘 Èd',
    lang: '🌐 Lang',
    human: '🙋 Yon moun',
    pickProduct: '🛍️ <b>Pwodwi nou yo</b>\nChwazi yon pwodwi:',
    pickVariant: 'Chwazi opsyon an:',
    options: 'Opsyon ki disponib yo:',
    buy: '🛒 Achte sou kerrytopup.com',
    back: '⬅️ Retounen',
    menu: '🏠 Menu',
    next: '➡️',
    prev: '⬅️',
    noProducts: 'Pa gen pwodwi pou kounya.',
    noVariants: 'Opsyon yo ap vini talè.',
    helpTxt: '🆘 <b>Èd</b>\nEkri kesyon w la, oswa itilize bouton yo. Si w bezwen yon moun, peze 🙋.',
    pickLang: '🌐 Chwazi lang ou:',
    langSet: '✅ Lang chanje.',
    err: '⚠️ Gen yon ti pwoblèm. Eseye ankò.',
    askId: '🔑 Pou m rekonèt ou, ekri <b>ID Kerry Topup ou</b> (8 chif). Ou jwenn li nan Kominote oswa nan pwofil ou.',
    idBad: '❌ Mwen pa jwenn ID sa a. Verifye l epi ekri l ankò (8 chif).',
    idOk: '✅ Mwen jwenn ou, <b>{n}</b>!',
    askPin: '🔐 Ekri <b>PIN 4 chif</b> ou (m ap efase mesaj la):',
    pinWrong: '❌ PIN la pa bon. Ou rete {n} eseye.',
    pinLocked: '⛔ Twòp move PIN. Eseye ankò nan {m} minit.',
    noPin: '⚠️ Ou poko gen PIN. Ale sou kerrytopup.com pou kreye l.',
    balanceIs: '💰 Balans ou: <b>{b}</b>',
    ordersTitle: '📦 <b>Dènye kòmand yo</b>',
    noOrders: 'Ou poko gen kòmand.',
    needId: 'Anvan, mwen bezwen konnen ki moun ou ye.',
    productPick: '💎 <b>{p}</b> — {v}\n💰 Pri: <b>{pr}</b>',
    askPlayer: 'Voye <b>ID jwè</b> a:',
    askServer: 'Voye <b>ID sèvè</b> a:',
    playerOk: '✅ Jwè: <b>{n}</b>',
    playerBad: '❌ Mwen pa ka verifye ID sa a. Verifye l epi eseye ankò.',
    askField: 'Ekri: <b>{f}</b>',
    askAmount: 'Ki montan ou vle (an $)? Ant {a} ak {b}.',
    amountBad: '❌ Montan an dwe ant {a} ak {b} $.',
    confirmQ: 'Kontinye?',
    yes: '🟢 Wi, kontinye',
    no: '🔙 Non',
    cancelled: 'Dakò, mwen anile.',
    total: '💰 Total: <b>{p}</b>',
    insufficient: '⚠️ Balans ou pa sifi. Fè yon rechaj sou kerrytopup.com.',
    orderOk: '✅ <b>Kòmand reyisi!</b>\n{p} — {v}',
    orderPending: '✅ <b>Kòmand resevwa</b> #{n}\n⏳ An kou. M ap ba w nouvèl lè l fini.',
    newBal: '💰 Nouvo balans: <b>{b}</b>',
    pinCode: '🔑 Kòd ou: <code>{c}</code>',
    orderFail: '⚠️ Kòmand lan pa pase. Verifye balans ou, oswa eseye ankò pita.',
    notOnBot: 'Pwodwi sa a pa disponib sou bot la ankò. Achte l sou sit la.',
    rechargeTxt: '➕ <b>Rechaj wallet</b>\nPou rechaje, ale sou kerrytopup.com → Wallet. Rechaj nan bot la ap vini talè.',
    humanOk: '🙋 Dakò. Mwen voye demann ou bay ekip la. Yon moun ap reponn ou.',
    notSure: '🤔 Mwen pa byen konprann. Ou ka esplike yon lòt fason, oswa chwazi yon bouton:',
    notify_done: '🔔 <b>Kòmand #{n} fini ✅</b>\n{p} — {v}',
    notify_cancel: '🔔 <b>Kòmand #{n}</b>: {s}',
    st_en_cours: '⏳ An kou',
    st_terminee: '✅ Fini',
    st_annulee: '❌ Anile',
    st_remboursee: '↩️ Ranbouse',
    st_echouee: '❌ Echwe',
    tut:'🎬 Tutoryèl',
    tutTitle:'🎬 <b>Tutoryèl</b>\n👆 Peze kesyon ou vle wè repons lan.',
    tutNone:'Pa gen tutoryèl pou kounya.',
    waBtn:'💬 WhatsApp',
    waTxt:'📱 Ou ka ekri nou sou WhatsApp tou:',
    nextP:'Pwochen',
    wait:'⏳ Ap trete kòmand ou...',
    succTitle:'🎉 <b>Achte reyisi !</b>',
    succDesc:'Kòmand ou resevwa avèk siksè.\nMèsi dèske w chwazi <b>Kerry Topup Official</b>, pwofite byen nan acha ou yo 🤗🛒💎',
    pendNote:'M ap ba w nouvèl lè l fini.',
    reorder:'🔁 Kòmande ankò',
    lblAcct:'Non kont', 
    rcInfo:'➕ <b>Rechaj wallet</b>\n\nVoye lajan an sou:\n📱 Nimewo: <code>{num}</code>\n👤 Non: <b>{name}</b>\n\n🔖 Mete referans sa a nan nòt peman an (peze pou kopye):\n<code>{ref}</code>\n\nLè w fin voye l, peze bouton an:',
    rcSent:'✅ Mwen voye lajan an',
    rcAmount:'Ki <b>montan</b> ou voye (HTG)?',
    rcAmountBad:'❌ Ekri yon montan ki valid (egzanp 500).',
    rcTxn:'Ekri <b>ID tranzaksyon</b> an (14 karaktè oswa plis):',
    rcTxnBad:'❌ ID tranzaksyon an twò kout (14 karaktè minimòm).',
    rcTxnUsed:'❌ ID tranzaksyon sa a deja itilize.',
    rcPhoto:'📸 Kounya voye <b>foto resi a</b>.',
    rcPhotoBad:'Mwen bezwen yon foto resi a (pa yon tèks).',
    rcReceiptUsed:'❌ Foto sa a deja itilize.',
    rcDone:'✅ <b>Demann rechaj resevwa</b>\n💰 {a} · 🔖 {r}\n⏳ Ekip la ap verifye l. M ap ba w nouvèl lè wallet ou kredite.',
    rcFail:'⚠️ Demann lan pa sove. Eseye ankò pita.',
    rcApproved:'🔔 <b>Rechaj ou apwouve ✅</b>\n💰 +{a}',
    rcRejected:'🔔 <b>Rechaj ou pa apwouve</b>\n🔖 {r}\nKontakte nou si w panse se yon erè.',
  },
  fr: {
    hello: '👋 Bonjour, bienvenue chez <b>Kerry Topup</b> !\nÉcrivez ce qu’il vous faut, ou choisissez un bouton :',
    welcome: '👋🏽 <b>BONJOUR / BONSOIR</b> 👋🏽\n\n💚 <b>BIENVENUE CHEZ KERRY TOPUP OFFICIAL !</b> 💎🔥\n\nNous sommes ravis que vous nous contactiez. 🙏🏽\nKerry Topup est là pour rendre vos recharges et services numériques plus faciles, plus rapides et plus pratiques. ⚡\n\n🎮 <b>Quelques-uns de nos services :</b>\n1️⃣ Free Fire Diamonds 💎\n2️⃣ Recharge Wise &amp; Meru\n3️⃣ Top-up E-Football ⚽\n4️⃣ Recharge PayPal 💰\n5️⃣ Blood Strike 🎯\n6️⃣ Flex City 🎮\n➕ D’autres services à venir...\n\n📢 Pour plus d’infos, promotions et nouveautés : https://chat.whatsapp.com/LW3tSzIAznP8Zf1LJl1WlE\n\n' +
      '👉🏽 Rejoignez notre communauté WhatsApp\n\n📲 Channel Kerry Topup : https://whatsapp.com/channel/0029Vb7SDqG1NCrMyxNOGo3Z\n\n👉🏽 Suivez-nous pour ne manquer aucune promo 🔥\n\n🌐 Visitez notre boutique :\n👉🏽 KerryTopup.com\n\n📩 Support :\n👉🏽 kerrytopup54@gmail.com\n\n💚 <b>KERRY TOPUP OFFICIAL</b>\n⚡ Rapide • 🔐 Sécurisé • 🤝 Fiable\n\n🙏🏽 Merci de votre confiance, et encore une fois : BIENVENUE DANS LA FAMILLE KERRY TOPUP ! 💚💎🚀',
    connBtn: '🔑 Se connecter',
    outBtn: '🚪 Se déconnecter',
    outDone: '🚪 <b>Vous êtes déconnecté.</b>\nJ’ai oublié le compte sur ce téléphone.\n\nPour vous reconnecter, envoyez votre <b>ID de compte</b> (8 chiffres).',
    hello_named: '👋 Bonjour <b>{n}</b> ! Que puis-je faire pour vous ?',
    products: '🛍️ Produits',
    balance: '💰 Solde',
    orders: '📦 Mes commandes',
    recharge: '➕ Recharge',
    help: '🆘 Aide',
    lang: '🌐 Langue',
    human: '🙋 Une personne',
    pickProduct: '🛍️ <b>Nos produits</b>\nChoisissez un produit :',
    pickVariant: 'Choisissez l’option :',
    options: 'Options disponibles :',
    buy: '🛒 Acheter sur kerrytopup.com',
    back: '⬅️ Retour',
    menu: '🏠 Menu',
    next: '➡️',
    prev: '⬅️',
    noProducts: 'Aucun produit pour le moment.',
    noVariants: 'Les options arrivent bientôt.',
    helpTxt: '🆘 <b>Aide</b>\nÉcrivez votre question, ou utilisez les boutons. Pour parler à une personne, appuyez sur 🙋.',
    pickLang: '🌐 Choisissez votre langue :',
    langSet: '✅ Langue modifiée.',
    err: '⚠️ Un petit problème est survenu. Réessayez.',
    askId: '🔑 Pour vous reconnaître, écrivez votre <b>ID Kerry Topup</b> (8 chiffres). Vous le trouvez dans la Communauté ou votre profil.',
    idBad: '❌ Je ne trouve pas cet ID. Vérifiez-le et réécrivez-le (8 chiffres).',
    idOk: '✅ Je vous ai trouvé, <b>{n}</b> !',
    askPin: '🔐 Écrivez votre <b>PIN à 4 chiffres</b> (je supprime le message) :',
    pinWrong: '❌ PIN incorrect. Il vous reste {n} essai(s).',
    pinLocked: '⛔ Trop de mauvais PIN. Réessayez dans {m} minutes.',
    noPin: '⚠️ Vous n’avez pas encore de PIN. Allez sur kerrytopup.com pour en créer un.',
    balanceIs: '💰 Votre solde : <b>{b}</b>',
    ordersTitle: '📦 <b>Dernières commandes</b>',
    noOrders: 'Vous n’avez pas encore de commande.',
    needId: 'D’abord, j’ai besoin de savoir qui vous êtes.',
    productPick: '💎 <b>{p}</b> — {v}\n💰 Prix : <b>{pr}</b>',
    askPlayer: 'Envoyez l’<b>ID du joueur</b> :',
    askServer: 'Envoyez l’<b>ID du serveur</b> :',
    playerOk: '✅ Joueur : <b>{n}</b>',
    playerBad: '❌ Je ne peux pas vérifier cet ID. Vérifiez-le et réessayez.',
    askField: 'Écrivez : <b>{f}</b>',
    askAmount: 'Quel montant voulez-vous (en $) ? Entre {a} et {b}.',
    amountBad: '❌ Le montant doit être entre {a} et {b} $.',
    confirmQ: 'Continuer ?',
    yes: '🟢 Oui, continuer',
    no: '🔙 Non',
    cancelled: 'D’accord, j’annule.',
    total: '💰 Total : <b>{p}</b>',
    insufficient: '⚠️ Solde insuffisant. Faites une recharge sur kerrytopup.com.',
    orderOk: '✅ <b>Commande réussie !</b>\n{p} — {v}',
    orderPending: '✅ <b>Commande reçue</b> #{n}\n⏳ En cours. Je vous préviens dès qu’elle est terminée.',
    newBal: '💰 Nouveau solde : <b>{b}</b>',
    pinCode: '🔑 Votre code : <code>{c}</code>',
    orderFail: '⚠️ La commande n’a pas abouti. Vérifiez votre solde, ou réessayez plus tard.',
    notOnBot: 'Ce produit n’est pas encore disponible sur le bot. Achetez-le sur le site.',
    rechargeTxt: '➕ <b>Recharge du wallet</b>\nPour recharger, allez sur kerrytopup.com → Wallet. La recharge via le bot arrive bientôt.',
    humanOk: '🙋 D’accord. J’ai transmis votre demande à l’équipe. Une personne vous répondra.',
    notSure: '🤔 Je n’ai pas bien compris. Vous pouvez reformuler, ou choisir un bouton :',
    notify_done: '🔔 <b>Commande #{n} terminée ✅</b>\n{p} — {v}',
    notify_cancel: '🔔 <b>Commande #{n}</b> : {s}',
    st_en_cours: '⏳ En cours',
    st_terminee: '✅ Terminée',
    st_annulee: '❌ Annulée',
    st_remboursee: '↩️ Remboursée',
    st_echouee: '❌ Échouée',
    tut:'🎬 Tutoriel',
    tutTitle:'🎬 <b>Tutoriel</b>\n👆 Touchez la question dont vous voulez voir la réponse.',
    tutNone:'Aucun tutoriel pour le moment.',
    waBtn:'💬 WhatsApp',
    waTxt:'📱 Vous pouvez aussi nous écrire sur WhatsApp :',
    nextP:'Suivant',
    wait:'⏳ Traitement de votre commande...',
    succTitle:'🎉 <b>Achat réussi !</b>',
    succDesc:'Votre commande a été reçue avec succès.\nMerci d’avoir choisi <b>Kerry Topup Official</b>, profitez bien de vos achats 🤗🛒💎',
    pendNote:'Je vous préviens dès qu’elle est terminée.',
    reorder:'🔁 Commander à nouveau',
    lblAcct:'Nom du compte',
    rcInfo:'➕ <b>Recharge du wallet</b>\n\nEnvoyez l’argent au :\n📱 Numéro : <code>{num}</code>\n👤 Nom : <b>{name}</b>\n\n🔖 Mettez cette référence dans la note du paiement (touchez pour copier) :\n<code>{ref}</code>\n\nUne fois envoyé, appuyez sur le bouton :',
    rcSent:'✅ J’ai envoyé l’argent',
    rcAmount:'Quel <b>montant</b> avez-vous envoyé (HTG) ?',
    rcAmountBad:'❌ Écrivez un montant valide (ex. 500).',
    rcTxn:'Écrivez l’<b>ID de transaction</b> (14 caractères ou plus) :',
    rcTxnBad:'❌ L’ID de transaction est trop court (14 caractères minimum).',
    rcTxnUsed:'❌ Cet ID de transaction a déjà été utilisé.',
    rcPhoto:'📸 Envoyez maintenant la <b>photo du reçu</b>.',
    rcPhotoBad:'J’ai besoin d’une photo du reçu (pas un texte).',
    rcReceiptUsed:'❌ Cette photo a déjà été utilisée.',
    rcDone:'✅ <b>Demande de recharge reçue</b>\n💰 {a} · 🔖 {r}\n⏳ L’équipe la vérifie. Je vous préviens quand votre wallet est crédité.',
    rcFail:'⚠️ La demande n’a pas été enregistrée. Réessayez plus tard.',
    rcApproved:'🔔 <b>Recharge approuvée ✅</b>\n💰 +{a}',
    rcRejected:'🔔 <b>Recharge non approuvée</b>\n🔖 {r}\nContactez-nous si vous pensez que c’est une erreur.',
  },
  en: {
    hello: '👋 Hello, welcome to <b>Kerry Topup</b>!\nWrite what you need, or choose a button:',
    welcome: '👋🏽 <b>HELLO / GOOD EVENING</b> 👋🏽\n\n💚 <b>WELCOME TO KERRY TOPUP OFFICIAL!</b> 💎🔥\n\nWe are very happy you contacted us. 🙏🏽\nKerry Topup is here to make your top-ups and digital services easier, faster and more convenient. ⚡\n\n🎮 <b>Some of our services:</b>\n1️⃣ Free Fire Diamonds 💎\n2️⃣ Wise &amp; Meru recharge\n3️⃣ E-Football Top-up ⚽\n4️⃣ PayPal recharge 💰\n5️⃣ Blood Strike 🎯\n6️⃣ Flex City 🎮\n➕ More services coming soon...\n\n📢 For more info, promotions and news: https://chat.whatsapp.com/LW3tSzIAznP8Zf1LJl1WlE\n\n👉🏽 Join our WhatsApp community\n\n' +
      '📲 Kerry Topup Channel: https://whatsapp.com/channel/0029Vb7SDqG1NCrMyxNOGo3Z\n\n👉🏽 Follow us so you never miss a promo 🔥\n\n🌐 Visit our shop:\n👉🏽 KerryTopup.com\n\n📩 Support:\n👉🏽 kerrytopup54@gmail.com\n\n💚 <b>KERRY TOPUP OFFICIAL</b>\n⚡ Fast • 🔐 Secure • 🤝 Reliable\n\n🙏🏽 Thank you for your trust, and once again: WELCOME TO THE KERRY TOPUP FAMILY! 💚💎🚀',
    connBtn: '🔑 Log in',
    outBtn: '🚪 Log out',
    outDone: '🚪 <b>You are logged out.</b>\nI forgot the account on this phone.\n\nTo log in again, send your <b>account ID</b> (8 digits).',
    hello_named: '👋 Hello <b>{n}</b>! What can I do for you?',
    products: '🛍️ Products',
    balance: '💰 Balance',
    orders: '📦 My orders',
    recharge: '➕ Top up',
    help: '🆘 Help',
    lang: '🌐 Language',
    human: '🙋 A person',
    pickProduct: '🛍️ <b>Our products</b>\nChoose a product:',
    pickVariant: 'Choose the option:',
    options: 'Available options:',
    buy: '🛒 Buy on kerrytopup.com',
    back: '⬅️ Back',
    menu: '🏠 Menu',
    next: '➡️',
    prev: '⬅️',
    noProducts: 'No products right now.',
    noVariants: 'Options are coming soon.',
    helpTxt: '🆘 <b>Help</b>\nWrite your question, or use the buttons. To talk to a person, press 🙋.',
    pickLang: '🌐 Choose your language:',
    langSet: '✅ Language changed.',
    err: '⚠️ Something went wrong. Please try again.',
    askId: '🔑 To recognise you, write your <b>Kerry Topup ID</b> (8 digits). You can find it in the Community or your profile.',
    idBad: '❌ I can’t find that ID. Check it and write it again (8 digits).',
    idOk: '✅ Found you, <b>{n}</b>!',
    askPin: '🔐 Write your <b>4-digit PIN</b> (I will delete the message):',
    pinWrong: '❌ Wrong PIN. {n} attempt(s) left.',
    pinLocked: '⛔ Too many wrong PINs. Try again in {m} minutes.',
    noPin: '⚠️ You don’t have a PIN yet. Go to kerrytopup.com to create one.',
    balanceIs: '💰 Your balance: <b>{b}</b>',
    ordersTitle: '📦 <b>Latest orders</b>',
    noOrders: 'You have no orders yet.',
    needId: 'First, I need to know who you are.',
    productPick: '💎 <b>{p}</b> — {v}\n💰 Price: <b>{pr}</b>',
    askPlayer: 'Send the <b>player ID</b>:',
    askServer: 'Send the <b>server ID</b>:',
    playerOk: '✅ Player: <b>{n}</b>',
    playerBad: '❌ I can’t verify that ID. Check it and try again.',
    askField: 'Write: <b>{f}</b>',
    askAmount: 'What amount do you want (in $)? Between {a} and {b}.',
    amountBad: '❌ The amount must be between {a} and {b} $.',
    confirmQ: 'Continue?',
    yes: '🟢 Yes, continue',
    no: '🔙 No',
    cancelled: 'OK, cancelled.',
    total: '💰 Total: <b>{p}</b>',
    insufficient: '⚠️ Insufficient balance. Top up on kerrytopup.com.',
    orderOk: '✅ <b>Order successful!</b>\n{p} — {v}',
    orderPending: '✅ <b>Order received</b> #{n}\n⏳ In progress. I will tell you when it is done.',
    newBal: '💰 New balance: <b>{b}</b>',
    pinCode: '🔑 Your code: <code>{c}</code>',
    orderFail: '⚠️ The order did not go through. Check your balance, or try again later.',
    notOnBot: 'This product is not available on the bot yet. Buy it on the website.',
    rechargeTxt: '➕ <b>Wallet top-up</b>\nTo top up, go to kerrytopup.com → Wallet. Top-up through the bot is coming soon.',
    humanOk: '🙋 OK. I sent your request to the team. A person will reply to you.',
    notSure: '🤔 I didn’t quite understand. You can rephrase, or choose a button:',
    notify_done: '🔔 <b>Order #{n} completed ✅</b>\n{p} — {v}',
    notify_cancel: '🔔 <b>Order #{n}</b>: {s}',
    st_en_cours: '⏳ In progress',
    st_terminee: '✅ Completed',
    st_annulee: '❌ Cancelled',
    st_remboursee: '↩️ Refunded',
    st_echouee: '❌ Failed',
    tut:'🎬 Tutorials',
    tutTitle:'🎬 <b>Tutorials</b>\n👆 Tap the question you want to see the answer to.',
    tutNone:'No tutorials yet.',
    waBtn:'💬 WhatsApp',
    waTxt:'📱 You can also message us on WhatsApp:',
    nextP:'Next',
    wait:'⏳ Processing your order...',
    succTitle:'🎉 <b>Purchase successful!</b>',
    succDesc:'Your order has been received successfully.\nThank you for choosing <b>Kerry Topup Official</b>, enjoy your purchases 🤗🛒💎',
    pendNote:'I will tell you when it is done.',
    reorder:'🔁 Order again',
    lblAcct:'Account name',
    rcInfo:'➕ <b>Wallet top-up</b>\n\nSend the money to:\n📱 Number: <code>{num}</code>\n👤 Name: <b>{name}</b>\n\n🔖 Put this reference in the payment note (tap to copy):\n<code>{ref}</code>\n\nOnce sent, press the button:',
    rcSent:'✅ I sent the money',
    rcAmount:'What <b>amount</b> did you send (HTG)?',
    rcAmountBad:'❌ Write a valid amount (e.g. 500).',
    rcTxn:'Write the <b>transaction ID</b> (14 characters or more):',
    rcTxnBad:'❌ The transaction ID is too short (14 characters minimum).',
    rcTxnUsed:'❌ This transaction ID has already been used.',
    rcPhoto:'📸 Now send the <b>receipt photo</b>.',
    rcPhotoBad:'I need a photo of the receipt (not text).',
    rcReceiptUsed:'❌ This photo has already been used.',
    rcDone:'✅ <b>Top-up request received</b>\n💰 {a} · 🔖 {r}\n⏳ The team is checking it. I will tell you when your wallet is credited.',
    rcFail:'⚠️ The request was not saved. Try again later.',
    rcApproved:'🔔 <b>Top-up approved ✅</b>\n💰 +{a}',
    rcRejected:'🔔 <b>Top-up not approved</b>\n🔖 {r}\nContact us if you think this is a mistake.',
  },
  es: {
    hello: '👋 ¡Hola, bienvenido a <b>Kerry Topup</b>!\nEscribe lo que necesitas, o elige un botón:',
    welcome: '👋🏽 <b>HOLA / BUENAS</b> 👋🏽\n\n💚 <b>¡BIENVENIDO A KERRY TOPUP OFFICIAL!</b> 💎🔥\n\nNos alegra mucho que nos contactes. 🙏🏽\nKerry Topup está aquí para hacer tus recargas y servicios digitales más fáciles, rápidos y prácticos. ⚡\n\n🎮 <b>Algunos de nuestros servicios:</b>\n1️⃣ Free Fire Diamonds 💎\n2️⃣ Recarga Wise &amp; Meru\n3️⃣ Top-up E-Football ⚽\n4️⃣ Recarga PayPal 💰\n5️⃣ Blood Strike 🎯\n6️⃣ Flex City 🎮\n➕ Más servicios próximamente...\n\n📢 Para más información, promociones y novedades: https://chat.whatsapp.com/LW3tSzIAznP8Zf1LJl1WlE\n\n👉🏽 Únete a nuestra comunidad de WhatsApp\n\n' +
      '📲 Canal Kerry Topup: https://whatsapp.com/channel/0029Vb7SDqG1NCrMyxNOGo3Z\n\n👉🏽 Síguenos para no perderte ninguna promo 🔥\n\n🌐 Visita nuestra tienda:\n👉🏽 KerryTopup.com\n\n📩 Soporte:\n👉🏽 kerrytopup54@gmail.com\n\n💚 <b>KERRY TOPUP OFFICIAL</b>\n⚡ Rápido • 🔐 Seguro • 🤝 Confiable\n\n🙏🏽 Gracias por tu confianza, y una vez más: ¡BIENVENIDO A LA FAMILIA KERRY TOPUP! 💚💎🚀',
    connBtn: '🔑 Conectar',
    outBtn: '🚪 Desconectar',
    outDone: '🚪 <b>Has cerrado sesión.</b>\nOlvidé la cuenta en este teléfono.\n\nPara volver a conectarte, envía tu <b>ID de cuenta</b> (8 dígitos).',
    hello_named: '👋 ¡Hola <b>{n}</b>! ¿Qué puedo hacer por ti?',
    products: '🛍️ Productos',
    balance: '💰 Saldo',
    orders: '📦 Mis pedidos',
    recharge: '➕ Recarga',
    help: '🆘 Ayuda',
    lang: '🌐 Idioma',
    human: '🙋 Una persona',
    pickProduct: '🛍️ <b>Nuestros productos</b>\nElige un producto:',
    pickVariant: 'Elige la opción:',
    options: 'Opciones disponibles:',
    buy: '🛒 Comprar en kerrytopup.com',
    back: '⬅️ Atrás',
    menu: '🏠 Menú',
    next: '➡️',
    prev: '⬅️',
    noProducts: 'No hay productos por ahora.',
    noVariants: 'Las opciones llegarán pronto.',
    helpTxt: '🆘 <b>Ayuda</b>\nEscribe tu pregunta, o usa los botones. Para hablar con una persona, pulsa 🙋.',
    pickLang: '🌐 Elige tu idioma:',
    langSet: '✅ Idioma cambiado.',
    err: '⚠️ Hubo un problema. Inténtalo de nuevo.',
    askId: '🔑 Para reconocerte, escribe tu <b>ID de Kerry Topup</b> (8 dígitos). Lo encuentras en la Comunidad o en tu perfil.',
    idBad: '❌ No encuentro ese ID. Revísalo y escríbelo otra vez (8 dígitos).',
    idOk: '✅ ¡Te encontré, <b>{n}</b>!',
    askPin: '🔐 Escribe tu <b>PIN de 4 dígitos</b> (borraré el mensaje):',
    pinWrong: '❌ PIN incorrecto. Te quedan {n} intento(s).',
    pinLocked: '⛔ Demasiados PIN incorrectos. Inténtalo en {m} minutos.',
    noPin: '⚠️ Aún no tienes PIN. Ve a kerrytopup.com para crearlo.',
    balanceIs: '💰 Tu saldo: <b>{b}</b>',
    ordersTitle: '📦 <b>Últimos pedidos</b>',
    noOrders: 'Aún no tienes pedidos.',
    needId: 'Primero, necesito saber quién eres.',
    productPick: '💎 <b>{p}</b> — {v}\n💰 Precio: <b>{pr}</b>',
    askPlayer: 'Envía el <b>ID del jugador</b>:',
    askServer: 'Envía el <b>ID del servidor</b>:',
    playerOk: '✅ Jugador: <b>{n}</b>',
    playerBad: '❌ No puedo verificar ese ID. Revísalo e inténtalo de nuevo.',
    askField: 'Escribe: <b>{f}</b>',
    askAmount: '¿Qué monto quieres (en $)? Entre {a} y {b}.',
    amountBad: '❌ El monto debe estar entre {a} y {b} $.',
    confirmQ: '¿Continuar?',
    yes: '🟢 Sí, continuar',
    no: '🔙 No',
    cancelled: 'De acuerdo, cancelado.',
    total: '💰 Total: <b>{p}</b>',
    insufficient: '⚠️ Saldo insuficiente. Recarga en kerrytopup.com.',
    orderOk: '✅ <b>¡Pedido exitoso!</b>\n{p} — {v}',
    orderPending: '✅ <b>Pedido recibido</b> #{n}\n⏳ En proceso. Te aviso cuando termine.',
    newBal: '💰 Nuevo saldo: <b>{b}</b>',
    pinCode: '🔑 Tu código: <code>{c}</code>',
    orderFail: '⚠️ El pedido no se completó. Revisa tu saldo, o inténtalo más tarde.',
    notOnBot: 'Este producto aún no está disponible en el bot. Cómpralo en el sitio.',
    rechargeTxt: '➕ <b>Recarga de wallet</b>\nPara recargar, ve a kerrytopup.com → Wallet. La recarga por el bot llegará pronto.',
    humanOk: '🙋 De acuerdo. Envié tu solicitud al equipo. Una persona te responderá.',
    notSure: '🤔 No entendí bien. Puedes reformular, o elegir un botón:',
    notify_done: '🔔 <b>Pedido #{n} terminado ✅</b>\n{p} — {v}',
    notify_cancel: '🔔 <b>Pedido #{n}</b>: {s}',
    st_en_cours: '⏳ En proceso',
    st_terminee: '✅ Terminado',
    st_annulee: '❌ Cancelado',
    st_remboursee: '↩️ Reembolsado',
    st_echouee: '❌ Fallido',
    tut:'🎬 Tutoriales',
    tutTitle:'🎬 <b>Tutoriales</b>\n👆 Toca la pregunta que quieres ver la respuesta.',
    tutNone:'Aún no hay tutoriales.',
    waBtn:'💬 WhatsApp',
    waTxt:'📱 También puedes escribirnos por WhatsApp:',
    nextP:'Siguiente',
    wait:'⏳ Procesando tu pedido...',
    succTitle:'🎉 <b>¡Compra exitosa!</b>',
    succDesc:'Tu pedido ha sido recibido con éxito.\nGracias por elegir <b>Kerry Topup Official</b>, disfruta tus compras 🤗🛒💎',
    pendNote:'Te aviso cuando termine.',
    reorder:'🔁 Pedir de nuevo',
    lblAcct:'Nombre de la cuenta',
    rcInfo:'➕ <b>Recarga de wallet</b>\n\nEnvía el dinero a:\n📱 Número: <code>{num}</code>\n👤 Nombre: <b>{name}</b>\n\n🔖 Pon esta referencia en la nota del pago (toca para copiar):\n<code>{ref}</code>\n\nCuando lo envíes, pulsa el botón:',
    rcSent:'✅ Ya envié el dinero',
    rcAmount:'¿Qué <b>monto</b> enviaste (HTG)?',
    rcAmountBad:'❌ Escribe un monto válido (ej. 500).',
    rcTxn:'Escribe el <b>ID de transacción</b> (14 caracteres o más):',
    rcTxnBad:'❌ El ID de transacción es demasiado corto (mínimo 14 caracteres).',
    rcTxnUsed:'❌ Este ID de transacción ya fue usado.',
    rcPhoto:'📸 Ahora envía la <b>foto del recibo</b>.',
    rcPhotoBad:'Necesito una foto del recibo (no texto).',
    rcReceiptUsed:'❌ Esta foto ya fue usada.',
    rcDone:'✅ <b>Solicitud de recarga recibida</b>\n💰 {a} · 🔖 {r}\n⏳ El equipo la está verificando. Te aviso cuando tu wallet esté acreditada.',
    rcFail:'⚠️ La solicitud no se guardó. Inténtalo más tarde.',
    rcApproved:'🔔 <b>Recarga aprobada ✅</b>\n💰 +{a}',
    rcRejected:'🔔 <b>Recarga no aprobada</b>\n🔖 {r}\nContáctanos si crees que es un error.',
  },
};
const LANGS = [['ht', 'Kreyòl'], ['fr', 'Français'], ['en', 'English'], ['es', 'Español']];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' HTG';
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (_, k) => (o && o[k] != null ? o[k] : ''));
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9+]/g, '');
const isPinProduct = (p) => p.type === 'pin';

async function sha256hex(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
}

/* --------------------------------- bot --------------------------------- */
export function makeBot({ token, db, fetchFn, mintUser, groq, ntfy }) {
  const api = async (method, body) => {
    const r = await fetchFn(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return r.json().catch(() => ({}));
  };
  const send = (chat, text, kb) => api('sendMessage', { chat_id: chat, text, parse_mode: 'HTML', reply_markup: kb, disable_web_page_preview: true });

  /* ----- chat state ----- */
  async function getChat(id, hint) {
    let row = null;
    try { const r = await db.from('tg_chats').select('*').eq('chat_id', id).maybeSingle(); row = r.data; } catch (_) {}
    const h = String(hint || '').slice(0, 2).toLowerCase();
    const lang = row && T[row.lang] ? row.lang : 'ht';
    return { chat_id: id, lang, user_id: row?.user_id || null, name: row?.name || null, state: row?.state || {}, pin_fail: row?.pin_fail || 0, locked_until: row?.locked_until || null, _h: h };
  }
  async function saveChat(c) {
    try {
      await db.from('tg_chats').upsert({ chat_id: c.chat_id, lang: c.lang, user_id: c.user_id, name: c.name, state: c.state || {}, pin_fail: c.pin_fail || 0, locked_until: c.locked_until || null, updated_at: new Date().toISOString() }, { onConflict: 'chat_id' });
    } catch (_) {}
  }

  const kbMenu = (t) => ({ inline_keyboard: [[{ text: t.products, callback_data: 'l:0' }, { text: t.balance, callback_data: 'bal' }], [{ text: t.orders, callback_data: 'ord' }, { text: t.recharge, callback_data: 'rec' }], [{ text: t.tut, callback_data: 'tut' }, { text: t.help, callback_data: 'h' }], [{ text: t.human, callback_data: 'hum' }, { text: t.lang, callback_data: 'g' }], [{ text: t.outBtn, callback_data: 'out' }]] });
  const kbMenuOnly = (t) => ({ inline_keyboard: [[{ text: t.menu, callback_data: 'm' }]] });

  /* ----- catalog ----- */
  async function loadProducts() {
    const { data, error } = await db.from('products').select('id,name,icon,active,sort_order,type,form_fields').order('sort_order', { ascending: true });
    if (error) throw error;
    return (data || []).filter((p) => p.active !== false);
  }
  async function loadVariants(pid) {
    const { data } = await db.from('variants').select('*').eq('product_id', pid).order('sort_order', { ascending: true });
    return data || [];
  }
  async function findVariantById(id) {
    const { data } = await db.from('variants').select('*').eq('id', id).maybeSingle();
    if (!data) return null;
    const { data: p } = await db.from('products').select('id,name,icon,active,type,form_fields').eq('id', data.product_id).maybeSingle();
    if (!p || p.active === false) return null;
    return { v: data, p };
  }
  async function loadCalc(pid) {
    const { data } = await db.from('manual_configs').select('*').eq('product_id', pid).maybeSingle();
    return data ? { taux: Number(data.taux), frais: Number(data.frais || 0), min: Number(data.min_amount), max: Number(data.max_amount), fields: data.fields || [], tiers: data.fee_tiers || [] } : null;
  }
  const feeFor = (c, a) => { const m = (c.tiers || []).find((x) => a >= x.min && a <= x.max); return m ? Number(m.fee) : c.frais || 0; };
  const fieldLabel = (f) => (typeof f === 'string' ? f : f?.label || f?.name || '');

  /* ----- PIN ----- */
  async function checkPin(chat, pin) {
    const now = Date.now();
    if (chat.locked_until && new Date(chat.locked_until).getTime() > now) return { ok: false, locked: Math.ceil((new Date(chat.locked_until).getTime() - now) / 60000) };
    const { data } = await db.auth.admin.getUserById(chat.user_id);
    const meta = data?.user?.user_metadata?.kt_pin;
    if (!meta || !meta.h || !meta.s) return { ok: false, noPin: true };
    const h = await sha256hex(meta.s + ':' + chat.user_id + ':' + pin);
    if (h === meta.h) { chat.pin_fail = 0; chat.locked_until = null; return { ok: true }; }
    chat.pin_fail = (chat.pin_fail || 0) + 1;
    if (chat.pin_fail >= MAX_PIN_FAIL) {
      chat.locked_until = new Date(now + LOCK_MIN * 60000).toISOString(); chat.pin_fail = 0;
      try { await ntfy('🔐 Telegram: PIN bloke', '👤 ' + (chat.name || chat.user_id) + '\nTwòp move PIN sou bot Telegram.', 'high', 'lock'); } catch (_) {}
      return { ok: false, locked: LOCK_MIN };
    }
    return { ok: false, left: MAX_PIN_FAIL - chat.pin_fail };
  }

  /* ----- views ----- */
  async function showMenu(chat, t, edit) {
    if (!chat.user_id) return out(chat, edit, t.welcome, { inline_keyboard: [[{ text: t.connBtn, callback_data: 'conn' }, { text: t.lang, callback_data: 'g' }]] });
    const text = chat.name ? fill(t.hello_named, { n: esc(chat.name) }) : t.hello;
    return out(chat, edit, text, kbMenu(t));
  }
  function out(chat, edit, text, kb) {
    if (edit && edit.message_id) return api('editMessageText', { chat_id: chat.chat_id, message_id: edit.message_id, text, parse_mode: 'HTML', reply_markup: kb, disable_web_page_preview: true });
    return send(chat.chat_id, text, kb);
  }

  async function listProducts(chat, t, page, edit) {
    const list = await loadProducts();
    if (!list.length) return out(chat, edit, t.noProducts, kbMenuOnly(t));
    const pages = Math.ceil(list.length / PER_PAGE);
    const pg = Math.min(Math.max(parseInt(page || '0', 10) || 0, 0), pages - 1);
    const rows = list.slice(pg * PER_PAGE, pg * PER_PAGE + PER_PAGE).map((p) => [{ text: ((p.icon && String(p.icon).length <= 4) ? p.icon + ' ' : '') + p.name, callback_data: 'p:' + p.id }]);
    const nav = [];
    if (pg > 0) nav.push({ text: t.prev + ' ' + pg + '/' + pages, callback_data: 'l:' + (pg - 1) });
    if (pg < pages - 1) nav.push({ text: t.nextP + ' ➡️ ' + (pg + 2) + '/' + pages, callback_data: 'l:' + (pg + 1) });
    if (nav.length) rows.push(nav);
    rows.push([{ text: t.menu, callback_data: 'm' }]);
    return out(chat, edit, t.pickProduct + (pages > 1 ? ' (' + (pg + 1) + '/' + pages + ')' : ''), { inline_keyboard: rows });
  }

  async function showProduct(chat, t, pid, edit) {
    const { data: p } = await db.from('products').select('id,name,active,type,form_fields').eq('id', pid).maybeSingle();
    if (!p || p.active === false) return listProducts(chat, t, 0, edit);
    if (p.type === 'calculator') {
      const c = await loadCalc(p.id);
      const body = '<b>' + esc(p.name) + '</b>' + (c ? '\n' + c.min + ' – ' + c.max + ' $ · ' + c.taux + ' G' : '');
      return out(chat, edit, body, { inline_keyboard: [[{ text: t.yes, callback_data: 'cx:' + p.id }], [{ text: t.back, callback_data: 'l:0' }, { text: t.menu, callback_data: 'm' }]] });
    }
    const vars = await loadVariants(p.id);
    if (!vars.length) return out(chat, edit, '<b>' + esc(p.name) + '</b>\n\n' + t.noVariants, { inline_keyboard: [[{ text: t.back, callback_data: 'l:0' }]] });
    const body = '<b>' + esc(p.name) + '</b>\n\n' + t.pickVariant + '\n' + vars.map((v) => '• ' + esc(v.label) + ' — <b>' + money(v.price) + '</b>').join('\n');
    const rows = vars.slice(0, 40).map((v) => [{ text: v.label + ' · ' + money(v.price), callback_data: 'v:' + v.id }]);
    rows.push([{ text: t.back, callback_data: 'l:0' }, { text: t.menu, callback_data: 'm' }]);
    return out(chat, edit, body, { inline_keyboard: rows });
  }

  /* ----- identify ----- */
  async function askIdentify(chat, t, then) {
    chat.state = { step: 'ask_id', then: then || null };
    await saveChat(chat);
    return send(chat.chat_id, t.askId);
  }
  async function identify(chat, t, publicId) {
    const { data } = await db.from('profiles').select('id,name').eq('public_id', publicId).maybeSingle();
    if (!data) return send(chat.chat_id, t.idBad);
    chat.user_id = data.id; chat.name = data.name || null;
    const then = chat.state && chat.state.then;
    chat.state = {};
    await saveChat(chat);
    await send(chat.chat_id, fill(t.idOk, { n: esc(chat.name || '') }));
    if (then) return resume(chat, t, then);
    return showMenu(chat, t);
  }
  async function resume(chat, t, then) {
    if (then.kind === 'bal') return showBalance(chat, t);
    if (then.kind === 'ord') return showOrders(chat, t);
    if (then.kind === 'rec') return rcStart(chat, t);
    if (then.kind === 'variant') return startVariant(chat, t, then.id);
    if (then.kind === 'calc') return startCalc(chat, t, then.id);
    return showMenu(chat, t);
  }

  async function askPin(chat, t, action) {
    if (chat.locked_until && new Date(chat.locked_until).getTime() > Date.now()) return send(chat.chat_id, fill(t.pinLocked, { m: Math.ceil((new Date(chat.locked_until).getTime() - Date.now()) / 60000) }));
    chat.state = { step: 'pin', action };
    await saveChat(chat);
    return send(chat.chat_id, t.askPin);
  }

  async function onPin(chat, t, msg) {
    const pin = String(msg.text || '').trim();
    try { await api('deleteMessage', { chat_id: chat.chat_id, message_id: msg.message_id }); } catch (_) {}
    if (!/^\d{4}$/.test(pin)) return send(chat.chat_id, t.askPin);
    const action = chat.state.action;
    const r = await checkPin(chat, pin);
    if (!r.ok) {
      if (r.noPin) { chat.state = {}; await saveChat(chat); return send(chat.chat_id, t.noPin, kbMenuOnly(t)); }
      if (r.locked) { chat.state = {}; await saveChat(chat); return send(chat.chat_id, fill(t.pinLocked, { m: r.locked }), kbMenuOnly(t)); }
      await saveChat(chat);
      return send(chat.chat_id, fill(t.pinWrong, { n: r.left }) + '\n' + t.askPin);
    }
    await saveChat(chat);
    if (action.kind === 'bal') { chat.state = {}; await saveChat(chat); return showBalance(chat, t); }
    if (action.kind === 'ord') { chat.state = {}; await saveChat(chat); return showOrders(chat, t); }
    if (action.kind === 'buy') return executeBuy(chat, t, action.buy);
    chat.state = {}; await saveChat(chat);
    return showMenu(chat, t);
  }

  async function getBalance(uid) {
    const { data } = await db.from('wallets').select('balance').eq('user_id', uid).maybeSingle();
    return Number(data?.balance) || 0;
  }
  async function showBalance(chat, t) {
    return send(chat.chat_id, fill(t.balanceIs, { b: money(await getBalance(chat.user_id)) }), kbMenuOnly(t));
  }
  const stLabel = (t, s) => t['st_' + s] || s;
  async function showOrders(chat, t) {
    const { data } = await db.from('orders').select('order_no,product,variant,status,created_at').eq('user_id', chat.user_id).order('created_at', { ascending: false }).limit(10);
    if (!data || !data.length) return send(chat.chat_id, t.noOrders, kbMenuOnly(t));
    const lines = data.map((o) => '#' + esc(o.order_no) + ' · ' + esc(o.product) + ' ' + esc(o.variant || '') + ' · ' + stLabel(t, o.status));
    return send(chat.chat_id, t.ordersTitle + '\n' + lines.join('\n'), kbMenuOnly(t));
  }

  /* ----- tutoryèl ----- */
  async function showTutorials(chat, t, edit) {
    const { data } = await db.from('tutorials_v2').select('id,title,video_url,active,order_num').order('order_num', { ascending: true });
    const list = (data || []).filter((x) => x.active !== false && x.video_url);
    if (!list.length) return out(chat, edit, t.tutNone, kbMenuOnly(t));
    const rows = list.slice(0, 40).map((x) => [{ text: String(x.title).slice(0, 60), callback_data: 'tu:' + x.id }]);
    rows.push([{ text: t.menu, callback_data: 'm' }]);
    return out(chat, edit, t.tutTitle, { inline_keyboard: rows });
  }
  async function sendTutorial(chat, t, id) {
    const { data: x } = await db.from('tutorials_v2').select('*').eq('id', id).maybeSingle();
    if (!x || !x.video_url) return showTutorials(chat, t);
    const cap = '<b>' + esc(x.title) + '</b>' + (x.description ? '\n' + esc(String(x.description).slice(0, 800)) : '');
    const direct = /\.(mp4|mov|webm|m4v)(\?|$)/i.test(x.video_url);
    let ok = false;
    if (direct) { const r = await api('sendVideo', { chat_id: chat.chat_id, video: x.video_url, caption: cap, parse_mode: 'HTML', supports_streaming: true, reply_markup: { inline_keyboard: [[{ text: t.tut, callback_data: 'tut' }, { text: t.menu, callback_data: 'm' }]] } }); ok = !!(r && r.ok !== false); }
    if (!ok) return send(chat.chat_id, cap + '\n\n▶️ ' + x.video_url, { inline_keyboard: [[{ text: t.tut, callback_data: 'tut' }, { text: t.menu, callback_data: 'm' }]] });
  }

  /* ----- rechaj wallet ----- */
  async function payInfo() {
    try {
      const { data } = await db.from('site_content').select('content').eq('key', 'payment_settings').maybeSingle();
      const j = JSON.parse(data?.content || '{}');
      return { number: j.number || '42614967', name: j.name || 'CADET VANSKERRY' };
    } catch (_) { return { number: '42614967',
    name: 'CADET VANSKERRY' }; }
  }
  async function newRef() {
    let used = new Set();
    try { const { data } = await db.from('recharge_requests').select('ref').order('created_at', { ascending: false }).limit(3000); used = new Set((data || []).map((r) => String(r.ref))); } catch (_) {}
    let ref; let n = 0;
    do { ref = String(Math.floor(10000 + Math.random() * 90000)); n++; } while (used.has(ref) && n < 60);
    return ref;
  }
  async function rcStart(chat, t) {
    if (!chat.user_id) return askIdentify(chat, t, { kind: 'rec' });
    const info = await payInfo(); const ref = await newRef();
    chat.state = { step: 'rc', rc: { step: 'go', ref } }; await saveChat(chat);
    return send(chat.chat_id, fill(t.rcInfo, { num: esc(info.number), name: esc(info.name), ref }), { inline_keyboard: [[{ text: t.rcSent, callback_data: 'rcgo' }], [{ text: t.menu, callback_data: 'm' }]] });
  }
  async function rcAskAmount(chat, t) {
    const st = chat.state || {};
    if (st.step !== 'rc' || !st.rc) return rcStart(chat, t);
    st.rc.step = 'amount'; chat.state = st; await saveChat(chat);
    return send(chat.chat_id, t.rcAmount);
  }
  async function onRcText(chat, t, msg) {
    const rc = chat.state.rc; const text = String(msg.text || '').trim();
    if (rc.step === 'amount') {
      const a = parseFloat(text.replace(',', '.'));
      if (!(a > 0)) return send(chat.chat_id, t.rcAmountBad);
      rc.amount = a; rc.step = 'txn'; chat.state = { step: 'rc', rc }; await saveChat(chat);
      return send(chat.chat_id, t.rcTxn);
    }
    if (rc.step === 'txn') {
      const txn = text.replace(/\s+/g, '');
      if (txn.length < 14) return send(chat.chat_id, t.rcTxnBad);
      const { data: dup } = await db.from('recharge_requests').select('id').eq('txn_id', txn).eq('status', 'approved').maybeSingle();
      if (dup) return send(chat.chat_id, t.rcTxnUsed);
      rc.txn = txn; rc.step = 'photo'; chat.state = { step: 'rc', rc }; await saveChat(chat);
      return send(chat.chat_id, t.rcPhoto);
    }
    return send(chat.chat_id, rc.step === 'photo' ? t.rcPhotoBad : t.rcAmount);
  }
  async function onRcPhoto(chat, t, msg) {
    const rc = chat.state.rc;
    if (rc.step !== 'photo' || !msg.photo || !msg.photo.length) return send(chat.chat_id, t.rcPhotoBad);
    try {
      const best = msg.photo[msg.photo.length - 1];
      const gf = await api('getFile', { file_id: best.file_id });
      const path = gf && gf.result && gf.result.file_path;
      if (!path) throw new Error('getFile');
      const resp = await fetchFn('https://api.telegram.org/file/bot' + token + '/' + path, { method: 'GET' });
      const bytes = new Uint8Array(await resp.arrayBuffer());
      const hb = await crypto.subtle.digest('SHA-256', bytes);
      const hash = Array.from(new Uint8Array(hb)).map((x) => x.toString(16).padStart(2, '0')).join('');
      const { data: dupH } = await db.from('recharge_requests').select('id').eq('receipt_hash', hash).eq('status', 'approved').maybeSingle();
      if (dupH) return send(chat.chat_id, t.rcReceiptUsed);
      const proofPath = chat.user_id + '/' + Date.now() + '_telegram.jpg';
      let stored = null;
      try { const up = await db.storage.from('recharge-proofs').upload(proofPath, bytes, { contentType: 'image/jpeg' }); if (!up.error) stored = proofPath; } catch (_) {}
      const ins = await db.from('recharge_requests').insert({ user_id: chat.user_id, amount: rc.amount, txn_id: rc.txn, ref: rc.ref, status: 'a_verifier', ocr_checks: null, receipt_hash: hash, proof_url: stored });
      if (ins.error) { if (ins.error.code === '23505') return send(chat.chat_id, t.rcTxnUsed, kbMenuOnly(t)); throw ins.error; }
      chat.state = {}; await saveChat(chat);
      try { await ntfy('⏳ Demand Rechaj (Telegram)', '👤 ' + (chat.name || '') + '\n💰 ' + rc.amount + ' HTG\n🔖 Referans : ' + rc.ref + '\n🧾 ID Tranzaksyon : ' + rc.txn + '\n📊 A verifier', 'high', 'moneybag'); } catch (_) {}
      return send(chat.chat_id, fill(t.rcDone, { a: money(rc.amount), r: rc.ref }), kbMenuOnly(t));
    } catch (e) {
      console.error('rc-error', String(e && e.message || e));
      return send(chat.chat_id, t.rcFail, kbMenuOnly(t));
    }
  }

  /* ----- purchase flows ----- */
  const confirmKb = (t) => ({ inline_keyboard: [[{ text: t.yes, callback_data: 'ok' }, { text: t.no, callback_data: 'no' }]] });

  async function startVariant(chat, t, variantId) {
    const f = await findVariantById(variantId);
    if (!f) return showMenu(chat, t);
    const { v, p } = f;
    if (!chat.user_id) return askIdentify(chat, t, { kind: 'variant', id: variantId });
    if (p.type === 'calculator') return startCalc(chat, t, p.id);
    const mode = v.order_mode || 'api_order';
    const buy = { kind: 'variant', variant_id: v.id, product_id: p.id, pname: p.name, vlabel: v.label, price: Number(v.price) };
    const head = fill(t.productPick, { p: esc(p.name), v: esc(v.label), pr: money(v.price) });
    if (p.type === 'api_topup' && mode !== 'api_pin') {
      buy.mode = 'api'; buy.step = 'player';
      chat.state = { step: 'buy', buy }; await saveChat(chat);
      return send(chat.chat_id, head + '\n\n' + t.askPlayer);
    }
    if (p.type === 'form') {
      const fields = (p.form_fields || []);
      buy.mode = 'form'; buy.fields = {}; buy.idx = 0; buy.step = 'field';
      if (!fields.length) { buy.step = 'confirm'; chat.state = { step: 'buy', buy }; await saveChat(chat); return send(chat.chat_id, head + '\n' + t.total.replace('{p}', money(v.price)) + '\n\n' + t.confirmQ, confirmKb(t)); }
      chat.state = { step: 'buy', buy }; await saveChat(chat);
      return send(chat.chat_id, head + '\n\n' + fill(t.askField, { f: esc(fieldLabel(fields[0])) }));
    }
    if (isPinProduct(p)) {
      buy.mode = mode === 'api_pin' ? 'api_pin' : 'pin'; buy.step = 'confirm';
      const { data: g } = await db.from('gift_card_variant_config').select('variant_id').eq('variant_id', v.id).maybeSingle();
      if (g) buy.mode = 'gift';
      chat.state = { step: 'buy', buy }; await saveChat(chat);
      return send(chat.chat_id, head + '\n\n' + t.confirmQ, confirmKb(t));
    }
    return send(chat.chat_id, t.notOnBot, { inline_keyboard: [[{ text: t.buy, url: SITE }], [{ text: t.menu, callback_data: 'm' }]] });
  }

  async function startCalc(chat, t, pid) {
    if (!chat.user_id) return askIdentify(chat, t, { kind: 'calc', id: pid });
    const { data: p } = await db.from('products').select('id,name,active').eq('id', pid).maybeSingle();
    const c = await loadCalc(pid);
    if (!p || p.active === false || !c) return showMenu(chat, t);
    const buy = { kind: 'calc',
    mode: 'calc', product_id: pid, pname: p.name, fields: {}, idx: 0, step: c.fields.length ? 'field' : 'amount' };
    chat.state = { step: 'buy', buy }; await saveChat(chat);
    if (buy.step === 'field') return send(chat.chat_id, '<b>' + esc(p.name) + '</b>\n' + fill(t.askField, { f: esc(fieldLabel(c.fields[0])) }));
    return send(chat.chat_id, '<b>' + esc(p.name) + '</b>\n' + fill(t.askAmount, { a: c.min, b: c.max }));
  }

  async function onBuyText(chat, t, msg) {
    const buy = chat.state.buy; const text = String(msg.text || '').trim();
    if (!text) return;
    if (buy.mode === 'api' && buy.step === 'player') {
      buy.player_id = text.replace(/\s+/g, '');
      const f = await findVariantById(buy.variant_id);
      if (f && f.v.requires_server_id && !f.v.fixed_server_id) { buy.step = 'server'; chat.state = { step: 'buy', buy }; await saveChat(chat); return send(chat.chat_id, t.askServer); }
      return verifyPlayer(chat, t, buy, f);
    }
    if (buy.mode === 'api' && buy.step === 'server') {
      buy.server_id = text.replace(/\s+/g, '');
      return verifyPlayer(chat, t, buy, await findVariantById(buy.variant_id));
    }
    if (buy.step === 'field') {
      let fields;
      if (buy.mode === 'form') { const f = await findVariantById(buy.variant_id); fields = f?.p.form_fields || []; }
      else { fields = (await loadCalc(buy.product_id))?.fields || []; }
      buy.fields[fieldLabel(fields[buy.idx])] = text; buy.idx++;
      if (buy.idx < fields.length) { chat.state = { step: 'buy', buy }; await saveChat(chat); return send(chat.chat_id, fill(t.askField, { f: esc(fieldLabel(fields[buy.idx])) })); }
      if (buy.mode === 'calc') { const c = await loadCalc(buy.product_id); buy.step = 'amount'; chat.state = { step: 'buy', buy }; await saveChat(chat); return send(chat.chat_id, fill(t.askAmount, { a: c.min, b: c.max })); }
      buy.step = 'confirm'; chat.state = { step: 'buy', buy }; await saveChat(chat);
      return send(chat.chat_id, fill(t.total, { p: money(buy.price) }) + '\n\n' + t.confirmQ, confirmKb(t));
    }
    if (buy.step === 'amount') {
      const c = await loadCalc(buy.product_id); const amt = parseFloat(text.replace(',', '.'));
      if (!(amt >= c.min && amt <= c.max)) return send(chat.chat_id, fill(t.amountBad, { a: c.min, b: c.max }));
      buy.amount = amt; buy.price = Math.round((amt + feeFor(c, amt)) * c.taux); buy.vlabel = amt + ' $'; buy.step = 'confirm';
      chat.state = { step: 'buy', buy }; await saveChat(chat);
      return send(chat.chat_id, '<b>' + esc(buy.pname) + '</b> — ' + amt + ' $\n' + fill(t.total, { p: money(buy.price) }) + '\n\n' + t.confirmQ, confirmKb(t));
    }
    return send(chat.chat_id, t.confirmQ, confirmKb(t));
  }

  async function verifyPlayer(chat, t, buy, f) {
    try {
      const user = await mintUser(chat.user_id);
      const { data, error } = await user.functions.invoke('partner-verify', { body: { partner_product_id: f.v.partner_product_id, player_id: buy.player_id, server_id: buy.server_id || f.v.fixed_server_id || undefined } });
      if (error || !data || data.error || data.valid === false || !data.name) throw new Error('verify');
      buy.player_name = data.name; buy.step = 'confirm';
      chat.state = { step: 'buy', buy }; await saveChat(chat);
      return send(chat.chat_id, fill(t.playerOk, { n: esc(data.name) }) + '\n' + fill(t.total, { p: money(buy.price) }) + '\n\n' + t.confirmQ, confirmKb(t));
    } catch (_) {
      buy.step = 'player'; chat.state = { step: 'buy', buy }; await saveChat(chat);
      return send(chat.chat_id, t.playerBad + '\n' + t.askPlayer);
    }
  }

  function orderCard(t, chat, buy, done, orderNo, pin, bal) {
    const L = [];
    L.push(t.succTitle, t.succDesc, '', '👤 <b>' + esc(chat.name || '') + '</b>', '📦 ' + esc(buy.pname), '🎯 ' + esc(buy.vlabel), '💰 HTG ' + Number(buy.price).toLocaleString('en-US'));
    if (buy.player_id) L.push('🎮 Player ID : ' + esc(buy.player_id));
    if (buy.player_name) L.push('✅ ' + t.lblAcct + ' : ' + esc(buy.player_name));
    for (const [k, v] of Object.entries(buy.fields || {})) L.push('✉️ ' + esc(k) + ' : ' + esc(v));
    L.push('📊 ' + (done ? stLabel(t, 'terminee') : stLabel(t, 'en_cours')));
    L.push('🆔 <code>' + esc(orderNo || '') + '</code>');
    if (pin) L.push('', fill(t.pinCode, { c: esc(pin) }));
    if (!done) L.push('', t.pendNote);
    L.push('', fill(t.newBal, { b: money(bal) }));
    return L.join('\n');
  }
  async function executeBuy(chat, t, buy) {
    chat.state = {}; await saveChat(chat);
    try {
      send(chat.chat_id, t.wait);
      const [bal0, user] = await Promise.all([getBalance(chat.user_id), mintUser(chat.user_id)]);
      if (bal0 < buy.price) return send(chat.chat_id, t.insufficient, kbMenuOnly(t));
      let order = null; let done = false; let pin = null; let orderNo = null;
      if (buy.mode === 'api' || buy.mode === 'api_pin') {
        orderNo = 'KT-' + Math.random().toString(36).slice(2, 10).toUpperCase();
        const row = { order_no: orderNo, user_id: chat.user_id, type: buy.mode === 'api' ? 'api_topup' : 'pin',
    status: 'en_cours', product: buy.pname, variant: buy.vlabel, price: buy.price, player_id: buy.player_id || null, server_id: buy.server_id || null, player_name: buy.player_name || null };
        const ins = await user.from('orders').insert(row).select().single();
        if (ins.error || !ins.data) throw new Error('insert');
        const body = { local_product_id: buy.variant_id, local_order_id: ins.data.id, quantity: 1 };
        if (buy.mode === 'api') { body.player_id = buy.player_id; if (buy.server_id) body.server_id = buy.server_id; }
        const { data, error } = await user.functions.invoke('partner-order', { body });
        if (error || !data || data.error) throw new Error('partner');
        done = data.order?.status === 'completed';
        pin = data.order?.pin || data.order?.code || data.pin || data.code || null;
        if (done) await user.from('orders').update({ status: 'terminee', ...(pin ? { pin_code: pin } : {}) }).eq('id', ins.data.id);
        order = ins.data;
      } else if (buy.mode === 'pin') {
        const { data, error } = await user.rpc('purchase_pin_secure', { p_variant_id: buy.variant_id });
        if (error) throw new Error('pin');
        done = data.status !== 'en_cours'; pin = data.pin_code || null; orderNo = data.order_no;
      } else if (buy.mode === 'gift') {
        const { data, error } = await user.rpc('purchase_gift_card_secure', { p_variant_id: buy.variant_id });
        if (error) throw new Error('gift');
        done = true; pin = data.pin_code || data.pin || null; orderNo = data.order_no;
      } else if (buy.mode === 'form') {
        const { data, error } = await user.rpc('create_form_order_secure', { p_variant_id: buy.variant_id, p_fields: buy.fields || {} });
        if (error) throw new Error('form');
        orderNo = data.order_no;
      } else if (buy.mode === 'calc') {
        const { data, error } = await user.rpc('create_manual_order_secure', { p_product_id: buy.product_id, p_amount_usd: buy.amount, p_fields: buy.fields || {} });
        if (error) throw new Error('calc');
        orderNo = data.order_no;
      }
      const bal = await getBalance(chat.user_id);
      let msg = orderCard(t, chat, buy, done, orderNo, pin, bal);
      try { await ntfy('🛒 Nouvelle commande (Telegram)', '👤 ' + (chat.name || '') + '\n📦 ' + buy.pname + '\n🎯 ' + buy.vlabel + '\n💰 HTG ' + buy.price + (buy.player_id ? '\n🎮 Player ID : ' + buy.player_id : '') + (buy.player_name ? '\n✅ Non kont : ' + buy.player_name : '') + '\n📊 ' + (done ? 'Terminée' : 'En cours') + '\n🆔 #' + (orderNo || ''), 'high', 'shopping_cart'); } catch (_) {}
      const again = buy.mode === 'calc' ? { text: t.reorder, callback_data: 'cx:' + buy.product_id } : { text: t.reorder, callback_data: 'v:' + buy.variant_id };
      return send(chat.chat_id, msg, { inline_keyboard: [[again, { text: t.orders, callback_data: 'ord' }], [{ text: t.menu, callback_data: 'm' }]] });
    } catch (_) {
      return send(chat.chat_id, t.orderFail, kbMenuOnly(t));
    }
  }

  /* ----- free text (IA + règ) ----- */
  async function understand(text, lang) {
    const fast = (() => {
      const n = norm(text);
      if (['menu', 'start', 'meni', 'accueil'].includes(n)) return { intent: 'menu' };
      return null;
    })();
    if (fast) return fast;
    try {
      const r = await groq([
        { role: 'system',
    content: 'You classify customer messages for Kerry Topup, a Haitian shop selling Free Fire diamonds, passes and gift cards. Customers write in Haitian Creole, French, English or Spanish. Reply ONLY with JSON: {"intent": one of ["menu","products","buy","price","balance","recharge","orders","human","greeting","question","other"], "product": string or "", "variant": string or "", "answer": string}. "buy" = wants to purchase; "price" = asks a price; put the product name and package/option text (e.g. "100+10", "310 diamonds") in product/variant. For "question", write a short helpful "answer" in the customer\'s language ONLY using general knowledge about how the shop works (buying on kerrytopup.com or this bot, paying with wallet, PIN). NEVER invent prices, delivery times, balances or order status; if unsure, tell them to press the human button. Never ask for passwords.' },
        { role: 'user', content: String(text).slice(0, 500) },
      ]);
      const j = JSON.parse(r);
      return { intent: j.intent || 'other', product: j.product || '', variant: j.variant || '', answer: j.answer || '' };
    } catch (e) {
      try { console.error('groq-error', String(e && e.message || e)); } catch (_) {}
      return { intent: 'other' };
    }
  }

  async function findOption(pq, vq) {
    const products = await loadProducts();
    const nv = norm(vq), np = norm(pq);
    let cands = products;
    if (np) { const m = products.filter((p) => norm(p.name).includes(np) || np.includes(norm(p.name))); if (m.length) cands = m; }
    const found = [];
    for (const p of cands) {
      if (p.type === 'calculator') { if (np && (norm(p.name).includes(np) || np.includes(norm(p.name)))) found.push({ p, v: null }); continue; }
      const vars = await loadVariants(p.id);
      for (const v of vars) { const l = norm(v.label); if (nv && l && (l === nv || l.includes(nv) || nv.includes(l))) found.push({ p, v }); }
      if (!nv && np && vars.length && cands.length === 1) found.push({ p, v: null });
    }
    return found;
  }

  /* Rekonesans san IA: chif pake a (egz. 100+10) + non pwodwi si moun nan site l */
  const keyOf = (str) => { const n = norm(str); const m = n.match(/\d+\+\d+/) || n.match(/\d{2,}/); return m ? m[0] : null; };
  async function matchByText(text) {
    const nt = norm(text);
    const keys = nt.match(/\d+\+\d+/g) || nt.match(/\d{2,}/g);
    if (!keys || /^\d{8}$/.test(String(text).trim())) return null;
    const products = await loadProducts();
    const pmap = new Map(products.map((p) => [p.id, p]));
    const { data } = await db.from('variants').select('id,product_id,label,price').limit(2000);
    let found = (data || []).filter((v) => pmap.has(v.product_id) && keys.includes(keyOf(v.label))).map((v) => ({ p: pmap.get(v.product_id), v }));
    if (!found.length) return null;
    const mentioned = found.filter((o) => { const pn = norm(String(o.p.name).replace(/\(.*?\)/g, '')); return pn.length >= 3 && nt.includes(pn); });
    if (mentioned.length) found = mentioned;
    found.price = /konbyen|combien|howmuch|cuanto|cuánto|\bpri\b|prix|price|precio/i.test(String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    return found;
  }

  const ruleIntent = (text) => {
    const n = String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (/(balans|balance|solde|saldo|konbyen kob|combien d.argent|how much money|cuanto dinero)/.test(n)) return 'balance';
    if (/(komand mwen|kommand mwen|mes commandes|my orders|mis pedidos|dernye komand|dènye kòmand)/.test(n)) return 'orders';
    if (/(rechaj|recharge|depo|deposit|top ?up|recargar|peye|payer|paiement|paye|pay|pagar|how to pay|kijan pou peye)/.test(n)) return 'recharge';
    if (/(pale ak yon moun|yon moun|personne|human|agent|une personne|una persona|asistans)/.test(n)) return 'human';
    if (/(pwodwi|produits|products|productos|achte|acheter|buy|comprar)/.test(n)) return 'products';
    return null;
  };
  async function mentionedProducts(text) {
    const nt = norm(text);
    const list = await loadProducts();
    return list.filter((p) => { const pn = norm(String(p.name).replace(/\(.*?\)/g, '')); return pn.length >= 4 && nt.includes(pn); });
  }

  async function onFreeText(chat, t, msg) {
    const text = String(msg.text || '').trim();
    if (/^\d{8}$/.test(text)) return identify(chat, t, text);
    const dm = await matchByText(text);
    if (dm) {
      if (dm.length === 1) {
        const { p, v } = dm[0];
        if (dm.price) return send(chat.chat_id, fill(t.productPick, { p: esc(p.name), v: esc(v.label), pr: money(v.price) }), { inline_keyboard: [[{ text: t.yes, callback_data: 'v:' + v.id }], [{ text: t.menu, callback_data: 'm' }]] });
        return startVariant(chat, t, v.id);
      }
      return send(chat.chat_id, t.pickVariant, { inline_keyboard: [...dm.slice(0, 10).map((o) => [{ text: o.p.name + ' · ' + o.v.label + ' · ' + money(o.v.price), callback_data: 'v:' + o.v.id }]), [{ text: t.menu, callback_data: 'm' }]] });
    }
    const rp = await mentionedProducts(text);
    if (rp.length === 1) return showProduct(chat, t, rp[0].id);
    if (rp.length > 1) return send(chat.chat_id, t.pickProduct, { inline_keyboard: [...rp.slice(0, 10).map((p) => [{ text: p.name, callback_data: 'p:' + p.id }]), [{ text: t.menu, callback_data: 'm' }]] });
    const ri = ruleIntent(text);
    if (ri === 'balance') return chat.user_id ? showBalance(chat, t) : askIdentify(chat, t, { kind: 'bal' });
    if (ri === 'orders') return chat.user_id ? showOrders(chat, t) : askIdentify(chat, t, { kind: 'ord' });
    if (ri === 'recharge') return rcStart(chat, t);
    if (ri === 'human') return human(chat, t, text);
    if (ri === 'products') return listProducts(chat, t, 0);
    const u = await understand(text, chat.lang);
    switch (u.intent) {
      case 'menu': case 'greeting': return showMenu(chat, t);
      case 'products': return listProducts(chat, t, 0);
      case 'balance': return chat.user_id ? showBalance(chat, t) : askIdentify(chat, t, { kind: 'bal' });
      case 'orders': return chat.user_id ? showOrders(chat, t) : askIdentify(chat, t, { kind: 'ord' });
      case 'recharge': return rcStart(chat, t);
      case 'human': return human(chat, t, text);
      case 'buy': case 'price': {
        const opts = await findOption(u.product, u.variant);
        if (opts.length === 1 && opts[0].v) {
          const { p, v } = opts[0];
          if (u.intent === 'price') return send(chat.chat_id, fill(t.productPick, { p: esc(p.name), v: esc(v.label), pr: money(v.price) }), { inline_keyboard: [[{ text: t.yes, callback_data: 'v:' + v.id }], [{ text: t.menu, callback_data: 'm' }]] });
          return startVariant(chat, t, v.id);
        }
        if (opts.length === 1 && !opts[0].v) return showProduct(chat, t, opts[0].p.id);
        if (opts.length > 1) return send(chat.chat_id, t.pickVariant, { inline_keyboard: [...opts.slice(0, 8).map((o) => [{ text: o.p.name + (o.v ? ' · ' + o.v.label + ' · ' + money(o.v.price) : ''), callback_data: o.v ? 'v:' + o.v.id : 'p:' + o.p.id }]), [{ text: t.menu, callback_data: 'm' }]] });
        return listProducts(chat, t, 0);
      }
      case 'question': if (u.answer) return send(chat.chat_id, esc(u.answer), kbMenu(t)); return send(chat.chat_id, t.notSure, kbMenu(t));
      default: return send(chat.chat_id, t.notSure, kbMenu(t));
    }
  }

  async function human(chat, t, text) {
    try { await ntfy('🙋 Telegram: kliyan bezwen yon moun', '👤 ' + (chat.name || 'Pa idantifye') + (chat.user_id ? '\n🆔 ' + chat.user_id : '') + '\n💬 ' + String(text || '').slice(0, 300) + '\n📱 chat_id: ' + chat.chat_id, 'high', 'raising_hand'); } catch (_) {}
    return send(chat.chat_id, t.humanOk + '\n\n' + t.waTxt + '\n' + WA_LINK, { inline_keyboard: [[{ text: t.waBtn, url: WA_LINK }], [{ text: t.menu, callback_data: 'm' }]] });
  }

  /* ----- notifikasyon estati (webhook DB) ----- */
  async function notifyOrder(rec) {
    if (rec.kind === 'recharge') return notifyRecharge(rec);
    try {
      const { data: chats } = await db.from('tg_chats').select('chat_id,lang').eq('user_id', rec.user_id);
      for (const c of chats || []) {
        const t = T[c.lang] || T.ht;
        const text = rec.status === 'terminee' ? fill(t.notify_done, { n: esc(rec.order_no), p: esc(rec.product), v: esc(rec.variant || '') }) : fill(t.notify_cancel, { n: esc(rec.order_no), s: stLabel(t, rec.status) });
        await send(c.chat_id, text);
      }
    } catch (_) {}
  }

  async function notifyRecharge(rec) {
    try {
      const { data: chats } = await db.from('tg_chats').select('chat_id,lang').eq('user_id', rec.user_id);
      for (const c of chats || []) {
        const t = T[c.lang] || T.ht;
        const ok = rec.status === 'approved';
        await send(c.chat_id, ok ? fill(t.rcApproved, { a: money(rec.amount) }) : fill(t.rcRejected, { r: esc(rec.ref) }), { inline_keyboard: [[{ text: t.balance, callback_data: 'bal' }, { text: t.menu, callback_data: 'm' }]] });
      }
    } catch (_) {}
  }

  /* ----- antre prensipal ----- */
  async function handle(update) {
    try {
      if (update.order_event) return notifyOrder(update.order_event);
      if (update.message && update.message.chat) {
        const m = update.message;
        const chat = await getChat(m.chat.id, m.from?.language_code);
        const t = T[chat.lang];
        const text = String(m.text || '');
        const st = chat.state || {};
        if (!text) { if (m.photo && st.step === 'rc' && st.rc) return onRcPhoto(chat, t, m); return; }
        if (/^\/start|^\/menu/i.test(text)) { chat.state = {}; await saveChat(chat); return showMenu(chat, t); }
        if (/^\/ai\b/i.test(text)) { try { await groq([{ role: 'user',
    content: 'Reply with JSON {"ok":true}' }]); return send(chat.chat_id, '✅ IA mache (Groq OK).'); } catch (e) { return send(chat.chat_id, '❌ IA pa mache: ' + esc(String(e && e.message || e).slice(0, 200))); } }
        if (st.step === 'rc' && st.rc && st.rc.step !== 'go') return onRcText(chat, t, m);
        if (st.step === 'pin') return onPin(chat, t, m);
        if (st.step === 'ask_id') { if (/^\d{8}$/.test(text.trim())) return identify(chat, t, text.trim()); return send(chat.chat_id, t.idBad); }
        if (st.step === 'buy' && st.buy && st.buy.step !== 'confirm') return onBuyText(chat, t, m);
        return onFreeText(chat, t, m);
      }
      const cq = update.callback_query;
      if (cq && cq.message) {
        const chat = await getChat(cq.message.chat.id, cq.from?.language_code);
        let t = T[chat.lang];
        const edit = { message_id: cq.message.message_id };
        const data = String(cq.data || 'm');
        const i = data.indexOf(':');
        const kind = i < 0 ? data : data.slice(0, i);
        const arg = i < 0 ? null : data.slice(i + 1);
        await api('answerCallbackQuery', { callback_query_id: cq.id });
        if (kind === 's') { if (T[arg]) { chat.lang = arg; t = T[arg]; await saveChat(chat); } return showMenu(chat, t, edit); }
        if (kind === 'm') { chat.state = {}; await saveChat(chat); return showMenu(chat, t, edit); }
        if (kind === 'g') return out(chat, edit, t.pickLang, { inline_keyboard: [LANGS.map(([c, n]) => ({ text: n, callback_data: 's:' + c })), [{ text: t.menu, callback_data: 'm' }]] });
        if (kind === 'h') return out(chat, edit, t.helpTxt, { inline_keyboard: [[{ text: t.buy, url: SITE }], [{ text: t.waBtn, url: WA_LINK }], [{ text: t.menu, callback_data: 'm' }]] });
        if (kind === 'l') return listProducts(chat, t, arg, edit);
        if (kind === 'p') return showProduct(chat, t, arg, edit);
        if (kind === 'conn') return askIdentify(chat, t, null);
        if (kind === 'out') { chat.user_id = null; chat.name = null; chat.state = {}; chat.pin_fail = 0; chat.locked_until = null; await saveChat(chat); return send(chat.chat_id, t.outDone); }
        if (kind === 'tut') return showTutorials(chat, t, edit);
        if (kind === 'tu') return sendTutorial(chat, t, arg);
        if (kind === 'rcgo') return rcAskAmount(chat, t);
        if (kind === 'v') return startVariant(chat, t, arg);
        if (kind === 'cx') return startCalc(chat, t, arg);
        if (kind === 'rec') return rcStart(chat, t);
        if (kind === 'hum') return human(chat, t, '');
        if (kind === 'bal') return chat.user_id ? showBalance(chat, t) : askIdentify(chat, t, { kind: 'bal' });
        if (kind === 'ord') return chat.user_id ? showOrders(chat, t) : askIdentify(chat, t, { kind: 'ord' });
        if (kind === 'no') { chat.state = {}; await saveChat(chat); return out(chat, edit, t.cancelled, kbMenuOnly(t)); }
        if (kind === 'ok') {
          const st = chat.state || {};
          if (st.step === 'buy' && st.buy && st.buy.step === 'confirm') return askPin(chat, t, { kind: 'buy', buy: st.buy });
          return showMenu(chat, t, edit);
        }
        return showMenu(chat, t, edit);
      }
    } catch (e) {
      try {
        const chatId = (update.message && update.message.chat.id) || (update.callback_query && update.callback_query.message.chat.id);
        if (chatId) await send(chatId, T.ht.err);
      } catch (_) {}
    }
  }
  return handle;
}

/* ------------------------- Ti app (paj /bot.html) ------------------------- */
// Menm sèvo bot la, men repons yo retounen bay paj la olye de Telegram.
const WEB_MIN = 7000000000000000, WEB_MAX = 7900000000000000;
export async function webReply(deps, body) {
  const { db, mintUser, groq, ntfy } = deps;
  const cid = Number(body.cid);
  if (!Number.isSafeInteger(cid) || cid < WEB_MIN || cid > WEB_MAX) return { msgs: [] };
  const msgs = [];
  let seq = 0;
  const base = Date.now() * 100;
  let photoBytes = null;
  if (body.photo) { try { const bin = atob(String(body.photo)); photoBytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) photoBytes[i] = bin.charCodeAt(i); } catch (_) {} }
  const webFetch = async (u, o) => {
    if (String(u).includes('/file/bot')) return { arrayBuffer: async () => (photoBytes || new Uint8Array(0)).buffer };
    const method = String(u).split('/').pop();
    if (method === 'getFile') return { json: async () => ({ ok: !!photoBytes, result: { file_path: 'web.jpg' } }) };
    let b = {};
    try { b = JSON.parse((o && o.body) || '{}'); } catch (_) {}
    const id = base + (++seq);
    if (method === 'sendMessage') msgs.push({ m: 'send', id, text: b.text || '', kb: b.reply_markup || null });
    else if (method === 'editMessageText') msgs.push({ m: 'edit', id: b.message_id, text: b.text || '', kb: b.reply_markup || null });
    else if (method === 'sendVideo') msgs.push({ m: 'video', id, video: b.video, text: b.caption || '', kb: b.reply_markup || null });
    else if (method === 'deleteMessage') msgs.push({ m: 'del', id: b.message_id });
    return { json: async () => ({ ok: true, result: { message_id: id } }) };
  };
  const handle = makeBot({ token: 'WEB', db, fetchFn: webFetch, mintUser, groq, ntfy });
  const from = { language_code: String(body.lang || '').slice(0, 2) };
  const mid = Number(body.mid) || base;
  let update;
  if (typeof body.cb === 'string') update = { callback_query: { id: 'w', data: body.cb.slice(0, 64), message: { chat: { id: cid }, message_id: Number(body.mid) || 0 }, from } };
  else if (photoBytes) update = { message: { message_id: mid, chat: { id: cid }, from, photo: [{ file_id: 'web' }] } };
  else update = { message: { message_id: mid, chat: { id: cid }, from, text: String(body.text || '').slice(0, 1000) } };
  try { await handle(update); } catch (e) { console.error('web-error', String((e && e.message) || e)); msgs.push({ m: 'send', id: base + 99, text: '⚠️ Erè. Eseye ankò.', kb: null }); }
  return { msgs };
}

/* ------------------------------ Deno serve ------------------------------ */
if (typeof Deno !== 'undefined' && Deno.serve) {
  const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, authorization, apikey, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!token) return new Response('TELEGRAM_BOT_TOKEN manke', { status: 500 });
    const secret = await sha256hex(token + ':kerrytopup-webhook');
    const url = new URL(req.url);
    const SB = Deno.env.get('SUPABASE_URL');
    const db = createClient(SB, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

    if (req.method === 'GET') {
      if (url.searchParams.get('setup') === '1') {
        const r = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: `${SB}/functions/v1/telegram-bot`, secret_token: secret, allowed_updates: ['message', 'callback_query'], drop_pending_updates: true }) });
        const j = await r.json();
        return new Response(j.ok ? '✅ Bot la konekte! Ale nan Telegram epi ekri /start.' : '❌ ' + JSON.stringify(j), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      return new Response('Kerry Topup bot OK');
    }

    const body = await req.json().catch(() => null);
    if (!body) return new Response('ok');

    const ntfy = async (title, message, priority, tag) => {
      try {
        const { data } = await db.from('site_content').select('content').eq('key', 'payment_settings').maybeSingle();
        const topic = JSON.parse(data?.content || '{}').ntfyTopic;
        if (!topic) return;
        await fetch('https://ntfy.sh/' + topic, { method: 'POST', body: message, headers: { Title: title.replace(/[^\x00-\x7F]/g, '').trim() || 'Kerry Topup', Priority: priority || 'high', Tags: tag || 'bell' } });
      } catch (_) {}
    };
    const groq = async (messages) => {
      const key = Deno.env.get('GROQ_API_KEY');
      if (!key) throw new Error('no key');
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, temperature: 0.2, response_format: { type: 'json_object' }, max_tokens: 400 }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error('HTTP ' + r.status + ': ' + ((j.error && j.error.message) || ''));
      return j.choices[0].message.content;
    };
    // Sesyon itilizatè (menm règ ak sit la): lyen magique -> sesyon
    const sessCache = (globalThis.__ktSess = globalThis.__ktSess || new Map());
    const mintUser = async (userId) => {
      const hit = sessCache.get(userId);
      if (hit && hit.exp > Date.now()) return hit.client;
      const client = await mintFresh(userId);
      sessCache.set(userId, { client, exp: Date.now() + 45 * 60 * 1000 });
      return client;
    };
    const mintFresh = async (userId) => {
      const { data: u } = await db.auth.admin.getUserById(userId);
      const email = u?.user?.email;
      const { data: l, error } = await db.auth.admin.generateLink({ type: 'magiclink', email });
      if (error) throw error;
      const anon = createClient(SB, Deno.env.get('SUPABASE_ANON_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });
      const { data: s, error: e2 } = await anon.auth.verifyOtp({ token_hash: l.properties.hashed_token, type: 'magiclink' });
      if (e2) throw e2;
      return createClient(SB, Deno.env.get('SUPABASE_ANON_KEY'), { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: 'Bearer ' + s.session.access_token } } });
    };
    if (body.web === true) {
      const r = await webReply({ db, mintUser, groq, ntfy }, body);
      return new Response(JSON.stringify(r), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    }
    const handle = makeBot({ token, db, fetchFn: fetch, mintUser, groq, ntfy });

    // Notifikasyon estati kòmand (soti nan trigger DB a)
    if (req.headers.get('X-KT-Notify')) {
      const { data: cfg } = await db.from('tg_config').select('value').eq('key', 'notify_secret').maybeSingle();
      if (!cfg || cfg.value !== req.headers.get('X-KT-Notify')) return new Response('forbidden', { status: 403 });
      await handle({ order_event: body });
      return new Response('ok');
    }
    if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== secret) return new Response('forbidden', { status: 403 });
    await handle(body);
    return new Response('ok');
  });
}
