const prompt = require("prompt-sync")({ sigint: true });

/*
 * Setiap pemain dia punya jumlah dadu dan point
 */

let initJmlPemain = parseInt(prompt("Masukan jumlah pemain : "));
let initJmlDadu = parseInt(prompt("Masukan jumlah dadu : "));

//deklarasi object pemain
class Pemain {
    constructor(jumlahDadu, point, id, angkaDadu) {
        this.id = id;
        this.jumlahDadu = jumlahDadu;
        this.point = point;
        this.angkaDadu = angkaDadu;
    }
}

let totalPemain = [];
let playablePlayer = [];

//looping pemain, lalu push ke totalPemain array dan ke playablePlayer
for (let i = 0; i < initJmlPemain; i++) {
    let pemain = new Pemain(initJmlDadu, 0, i + 1, []);
    //push ke totalPemain dan playablePlayer
    totalPemain.push(pemain);
    playablePlayer.push(pemain);
}

//buat tempArr untuk menampung angka 1
let tempArr = [];
for (let i = 0; i < playablePlayer.length; i++) {
    //buat array kosong di dalam tempArr sesuai jumlah playablePlayer
    tempArr.push([]);
}

//selama pemain belum tersisa 1, maka permainan terus berlangsung
let play = true;

while (play) {
    //mulai sesi lempar dadu
    let isLempar = true;
    let giliran = 1;

    while (isLempar) {
        let inpLempar = prompt(`Lempar dadu ke ${giliran}? [y/n] : `);
        if (inpLempar === "y") {
            //cek apakah pemain masih memiliki dadu
            for (let i = 0; i < playablePlayer.length; i++) {
                //jika tidak memiliki dadu
                if (playablePlayer[i].jumlahDadu == 0) {
                    //maka hapus dari playable player
                    playablePlayer.splice(i, 1);
                    //hapus tempArr
                    tempArr.splice(i, 1);
                }
            }

            // console.log("Playable player : ", playablePlayer);

            //acak dadu
            playablePlayer.forEach((pl) => {
                //acak dadu playablePlayer sesuai dengan jumlah dadu
                pl.angkaDadu = acakDadu(pl.jumlahDadu);
            });

            console.clear();
            //tampilkan hasil acak dadu
            console.log(`Giliran ${giliran} lempar dadu : `, totalPemain);
            console.log("\n");

            //mulai sesi evaluasi
            let isEvaluasi = true;

            while (isEvaluasi) {
                for (let i = 0; i < playablePlayer.length; i++) {
                    //jika ada angka 6, maka pemain dapat 1 poin
                    let find6 = playablePlayer[i].angkaDadu.filter((el) => el == 6);
                    if (find6.length > 0) {
                        //tambah point pemain
                        playablePlayer[i].point += find6.length;
                        //hapus semua angka 6
                        playablePlayer[i].angkaDadu = playablePlayer[i].angkaDadu.filter(
                            (el) => el != 6
                        );
                    }

                    //cek apakah ada angka 1
                    let find1 = playablePlayer[i].angkaDadu.filter((el) => el == 1);
                    if (find1.length > 0) {
                        //tampung dulu di tempArr
                        tempArr[i] = find1;

                        //Hapus semua angka satu
                        playablePlayer[i].angkaDadu = playablePlayer[i].angkaDadu.filter(
                            (el) => el != 1
                        );
                    }
                }

                // console.log("tempArr sebelum di unshift", tempArr);

                //unshift arr tempArr ke kanan
                for (let i = 0; i < 1; i++) {
                    tempArr.unshift(tempArr.pop());
                }
                // console.log("tempArr setelah di unshift", tempArr);

                //concat dari tempArr yg sudah di unshift ke playablePlayer
                for (let i = 0; i < playablePlayer.length; i++) {
                    playablePlayer[i].angkaDadu = [
                        ...tempArr[i],
                        ...playablePlayer[i].angkaDadu,
                    ];

                    playablePlayer[i].jumlahDadu = playablePlayer[i].angkaDadu.length;
                }

                //tampilkan hasil evaluasi
                console.log("Evaluasi : ", totalPemain);
                console.log("\n");

                //kita reset angka dadu dan reset tempArr
                for (let i = 0; i < playablePlayer.length; i++) {
                    playablePlayer[i].angkaDadu = [];
                    tempArr[i] = [];
                }

                //apakah pemain playable belum tersisa 1?
                if (playablePlayer.length !== 1) {
                    //jika iya maka lanjutkan sesi lempar
                    isEvaluasi = false;
                    continue;
                } else {
                    //jika tidak, maka keluar dari sesi lempar
                    isEvaluasi = false;
                    isLempar = false;
                }
            }
        } else if (inpLempar === "n") {
            console.log("Sesi lempar dadu berakhir!");
            isLempar = false;
            play = false;
        } else {
            console.log("input tidak valid!");
            continue;
        }
        // isLempar = false;
        // play = false;

        giliran++;
    }

    //cek poin yang terbesar
    let poinArr = [];

    for (let i = 0; i < totalPemain.length; i++) {
        poinArr.push(totalPemain[i].point);
    }

    const biggestPoint = Math.max(...poinArr);

    const indexWinner = poinArr.indexOf(biggestPoint);
    const winner = totalPemain[indexWinner];

    console.log("Pemenangnya adalah : ", winner);

    play = false;
}

function acakDadu(num) {
    //Acak angka 1 - 6
    let result = [];
    for (let i = 0; i < num; i++) {
        result.push(Math.floor(Math.random() * 6) + 1);
    }
    return result;
}