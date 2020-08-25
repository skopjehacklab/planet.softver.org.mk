// This cookie example is from the book _JavaScript: The Definitive Guide_.     
// Written by David Flanagan.  Copyright (c) 1996 O'Reilly & Associates. 
// Ostanatiot kod od Georgi Stanojevski, 2007


function Cookie(document, name, hours, path, domain, secure)
{
    // All the predefined properties of this object begin with '$'
    // to distinguish them from other properties which are the values to
    // be stored in the cookie.
    this.$document = document;
    this.$name = name;
    if (hours)
        this.$expiration = new Date((new Date()).getTime() + hours*3600000);
    else this.$expiration = null;
    if (path) this.$path = path; else this.$path = null;
    if (domain) this.$domain = domain; else this.$domain = null;
    if (secure) this.$secure = true; else this.$secure = false;
}

function _Cookie_store()
{
    var cookieval = "";
    for(var prop in this) {
        if ((prop.charAt(0) == '$') || ((typeof this[prop]) == 'function')) 
            continue;
        if (cookieval != "") cookieval += '&';
        cookieval += prop + ':' + escape(this[prop]);
    }

    var cookie = this.$name + '=' + cookieval;
    if (this.$expiration)
        cookie += '; expires=' + this.$expiration.toGMTString();
    if (this.$path) cookie += '; path=' + this.$path;
    if (this.$domain) cookie += '; domain=' + this.$domain;
    if (this.$secure) cookie += '; secure';

    this.$document.cookie = cookie;
}

function _Cookie_load()
{
    var allcookies = this.$document.cookie;
    if (allcookies == "") return false;

    var start = allcookies.indexOf(this.$name + '=');
    if (start == -1) return false;   
    start += this.$name.length + 1;  
    var end = allcookies.indexOf(';', start);
    if (end == -1) end = allcookies.length;
    var cookieval = allcookies.substring(start, end);

    var a = cookieval.split('&');  
    for(var i=0; i < a.length; i++) 
        a[i] = a[i].split(':');

    for(var i = 0; i < a.length; i++) {
        this[a[i][0]] = unescape(a[i][1]);
    }

    return true;
}

function _Cookie_remove()
{
    var cookie;
    cookie = this.$name + '=';
    if (this.$path) cookie += '; path=' + this.$path;
    if (this.$domain) cookie += '; domain=' + this.$domain;
    cookie += '; expires=Fri, 02-Jan-1970 00:00:00 GMT';

    this.$document.cookie = cookie;
}


new Cookie();
Cookie.prototype.store = _Cookie_store;
Cookie.prototype.load = _Cookie_load;
Cookie.prototype.remove = _Cookie_remove;


/* Mojot kod, glisha@gmail.com, 2007 */

var blokiranikolache = new Cookie(document, "blokirani_korisnici", 4800);

function init_blokiranje() {
// Gi chuva vo kolacheto iminja=petko;stanko;ranko tie shto treba da gi skrie.

if (!blokiranikolache.load() || !blokiranikolache.iminja ) {
    blokiranikolache.iminja = "blablablablabla";
}  

var koi = blokiranikolache.iminja.split(';');
for(var i=1; i < koi.length; i++) {  // odi niz site iminja i skrij gi
    sokrij(koi[i]);    
}

// na sekoja lodiranje snimi go kolacheto t.e. nikogash nema da isteche ako korisnikot 
// ja poseti barem ednash vo 200 dena. 
blokiranikolache.store();

}

function pokazhiplus(idto) {
    // Pokazhuva plus mesto minus za da mozhe da go vrati avtorot
    // Ja vrakja bojata i rss ikonata
    var zitel_link = document.getElementById(idto);

    if ( zitel_link ) { // da ne e trgnat od planetata vo megjuvreme avtorot skroz
//        zitel_link.style.color = '#e9e9e9'; // bojata izbledi ja na imeto
        zitel_link.className = 'skrienlink';

        var zitel_trgni = document.getElementById('trgni_'+idto); // trgni go minusot
        zitel_trgni.style.display='none';

        var zitel_pokazhi = document.getElementById('pokazhi_'+idto); // pokazhi go plusot
        zitel_pokazhi.style.display='inline';

        var zitel_rss = document.getElementById('rss_'+idto); // stavi izbledena rss ikona
        zitel_rss.src = "images/feed-icon-8x8_1.png";
    }
}

function pokazhiminus(idto) {
    // Pokazhuva plus mesto minus za da mozhe da go vrati avtorot
    // Ja vrakja bojata i rss ikonata
    var zitel_link = document.getElementById(idto);

    if ( zitel_link ) { // da ne e trgnat od planetata vo megjuvreme avtorot skroz
//        zitel_link.style.color = '#990000'; // bojata smeni ja za pokazhan
        zitel_link.className = 'pokazhanlink';

        var zitel_pokazhi = document.getElementById('pokazhi_'+idto); // trgni go plusot
        zitel_pokazhi.style.display='none';


        var zitel_trgni = document.getElementById('trgni_'+idto); // pokazhi go minusot
        zitel_trgni.style.display='inline';

        var zitel_rss = document.getElementById('rss_'+idto); // stavi normalna rss ikona
        zitel_rss.src = "images/feed-icon-8x8.png";
    }
}



function sokrij(idto) {
    // Sokrij gi site  div-ovi koi imaat name=imeto
    // staj mu plus do imeto za da mozhe da gi pokazhe

    pokazhiplus(idto); // da pokazhe plus mesto minusot i da go izbledi imeto

//    var site=document.getElementsByName(idto);
    var site=getElementsByName_iefix('div',idto);

    for (var i=0; i<site.length; i++) {
            site[i].style.display='none';
    }
}

function prikazhi(idto) {
    // Prikazhi gi site  div-ovi koi imaat name=imeto

    pokazhiminus(idto); // da pokazhe minus mesto plusot i da ja vrati normalnata boja na imeto

//    var site=document.getElementsByName(idto);
    var site=getElementsByName_iefix('div',idto);

    for (var i=0; i<site.length; i++) {
            site[i].style.display='block';

    }

}

function stai(imeto,avtor) {
    // Kje stavi vo kolacheto i ova ime za da ne go pokazhuva

    var r=confirm("Повеќе нема да гледате статии од „"+avtor+"“.\nСигурно?")
    if (r==true)
    {
        var goima = false;
        blokiranikolache.load();  
        var koi = blokiranikolache.iminja.split(';');
        for (var i=0; i< koi.length; i++) { // da ne go ima vekje
            if ( koi[i] == imeto ) goima = true;
        }
        
        if ( !goima ) {
            blokiranikolache.iminja=blokiranikolache.iminja + ";" + imeto; // staj go vo kolacheto
            blokiranikolache.store(); // snimi go kolacheto
            sokrij(imeto);
        }
    }
    return false;
}

function izvadi(imeto) {
    // kje go izvadi od kolacheto ova ime, za da si go pokazhuva.

    blokiranikolache.load();

    var koi = blokiranikolache.iminja.split(';');
    for (var i=0; i< koi.length; i++) {
        if ( koi[i] == imeto ) { 
            koi.splice(i,1);
            prikazhi(imeto);
        }
    }

    blokiranikolache.iminja = koi.join(';');
    blokiranikolache.store();
    return false;
}

function resetiraj() {
    // trgni go kolacheto t.e prikazhuvaj gi site.
    blokiranikolache.remove();    
}

function getElementsByName_iefix(tag, name) {
    // poshto IE i Opera (spored W3C ne davaat name= na div elementi
     var elem = document.getElementsByTagName(tag);
     var arr = new Array();
     for(var i = 0, iarr = 0; i < elem.length; i++) {
          var att = elem[i].getAttribute("name");
          if(att == name) {
               arr[iarr] = elem[i];
               iarr++;
          }
     }
     return arr;
}


