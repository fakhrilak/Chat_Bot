const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const utf8 = require('utf8');
const bot = new TelegramBot(token, {polling: true});




bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  var first_name = msg.from.first_name
  var last_name = msg.from.last_name
  var username = msg.from.username


  var data = msg.text.split(' ')
  if (data[0] == "how" || data[0] == "How"){
    var a = "Mencari Topik :\nhadits (bab yg ingin dicari) (nama rawi) \nContoh : \n hadits marah Sunan_Tirmidzi"
    var b = "Mencari Hadits Dengan Id :\nhadits get (nama rawi) (id) \nContoh : \nhadits get Sunan_Tirmidzi 86"
    var c = "Mencari Surat : \nquran (no surat) (ayat) \nContoh: \nquran 1 1 \nquran 1 1-2"
    bot.sendMessage(chatId,"Melihat Raawi yg tersedia\nRaawi\n\n" +a+"\n\n"+b+"\n\n"+c);
    if (chatId !== 892248157){
        bot.sendMessage(892248157, first_name +"\n"+last_name+"\n"+username+"\nMenggunakan bot anda");
    }
    
  }
  else if(data[0]=="Raawi" || data[0]=="raawi"){
    var Raawi = "Arbain_Nawawi_I \nArbain_Nawawi_II \nShahih_Adabul_Mufrad_Terjemah \nShahih_Bukhari \nShahih_Ibnu_Hibban \nShahih_Ibnu_Khuzaimah \nShahih_Muslim \nSunan_Abu_Daud \nSunan_Ibnu_Majah \nSunan_Tirmidzi"
    bot.sendMessage(chatId, Raawi);
    if (chatId !== 892248157){
        bot.sendMessage(892248157, first_name +"\n"+last_name+"\n"+username+"\nMenggunakan bot anda");
    }
  }
  else if(data[0]=="Hadits" || data[0]=="hadits"){
    if (data[1]!=="get"){
        var result = ""
        fetch("http://api.carihadis.com/?q="+data[1])
        .then(res => res.json())
        .then(text => {
            result = text.data
            for (var i = 0;i < result.length;i++){
                var id = ""
                if (result[i].kitab == data[2]){
                    console.log(result[i].id.length)
                    for (var k = 0 ;k<result[i].id.length;k++){
                        id += result[i].id[k]+" ,"
                    }
                    bot.sendMessage(chatId,data[2] +"\n\n"+id);
                    if (chatId !== 892248157){
                        bot.sendMessage(892248157, first_name +"\n"+last_name+"\n"+username+"\nMenggunakan bot anda");
                    }
                }
            }
        })
    }
    else if(data[1]=="get"){
        var result = ""
        fetch("http://api.carihadis.com/?kitab="+data[2]+"&id="+data[3])
        .then(res => res.json())
        .then(text => {
            var arab = text.data["1"].nass
            var terjemah = text.data["1"].terjemah
            bot.sendMessage(chatId,arab+"\n\n"+terjemah)
            if (chatId !== 892248157){
                bot.sendMessage(892248157, first_name +"\n"+last_name+"\n"+username+"\nMenggunakan bot anda");
            }
        })
        .expect(error=>console.log(error))
    }
        
  }
  else if(data[0]=="Quran" || data[0]=="quran"){
    var result = ""
    fetch("https://api.banghasan.com/quran/format/json/surat/"+data[1]+"/ayat/"+data[2])
    .then(res => res.json())
    .then(text => {
        if (text.ayat.data.ar.length > 2){
            bot.sendMessage(chatId,"Maksimal 2 ayat sobat sholih")
            if (chatId !== 892248157){
                bot.sendMessage(892248157, first_name +"\n"+last_name+"\n"+username+"\nMenggunakan bot anda");
            }
        }
        else{
            for (var i = 0;i<text.ayat.data.ar.length;i++){
                console.log(text.ayat.data.ar[i].teks)
                result+=text.ayat.data.ar[i].teks+"\n\n"
                result+=text.ayat.data.id[i].teks+"\n\n"
            }
            bot.sendMessage(chatId,result)
            if (chatId !== 892248157){
        bot.sendMessage(892248157, first_name +"\n"+last_name+"\n"+username+"\nMenggunakan bot anda");
    }
        }
        
    })
  }

});