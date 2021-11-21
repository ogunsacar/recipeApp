import { TIMEOUT_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  // sürekli yapacağımız işlemleri helpers.js in içinde toplayıp export ediyoruz. Burada async fonksiyonun içinde async fonksiyonu çalıştırmış oluyoruz. Ve ayrıca parent async fonksiyonun içindeki erroru düzenleyebilmemiz için buradaki try-catch bloğundaki erroru throwlamamız gerekiyor.
  try {
    const res = await Promise.race([
      fetch(
        url // id hash'li url fetch edilir.
      ),
      timeout(TIMEOUT_SECONDS),
    ]);
    const data = await res.json(); // response json'a dönüştürülür.

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // eğer fetch etme sırasında hata oluşursa yeni error oluşturulur.
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};
