window.StaticPix = (() => {
  function crc16(text) {
    let crc = 0xffff;
    for (const character of text) {
      crc ^= character.charCodeAt(0) << 8;
      for (let bit = 0; bit < 8; bit++) crc = ((crc << 1) ^ ((crc & 0x8000) ? 0x1021 : 0)) & 0xffff;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }
  function field(id, value) {
    if (value.length > 99 || /[^\x20-\x7e]/.test(value)) throw new Error('Invalid Pix field');
    return id + String(value.length).padStart(2, '0') + value;
  }
  function clean(value, limit) {
    const result = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 .-]/g, '').trim().slice(0, limit);
    if (!result) throw new Error('Missing Pix recipient data');
    return result;
  }
  function build({ key, name, city, cents = null }) {
    if (!key || key.length > 77) throw new Error('Invalid Pix key');
    if (cents !== null && (!Number.isSafeInteger(cents) || cents <= 0 || cents > 99999999999)) throw new Error('Invalid Pix amount');
    const account = field('00', 'br.gov.bcb.pix') + field('01', key);
    let payload = field('00', '01') + field('26', account) + field('52', '0000') + field('53', '986');
    if (cents !== null) payload += field('54', `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`);
    payload += field('58', 'BR') + field('59', clean(name, 25)) + field('60', clean(city, 15)) + field('62', field('05', '***')) + '6304';
    return payload + crc16(payload);
  }
  return Object.freeze({ build, crc16 });
})();
