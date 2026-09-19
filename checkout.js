(() => {
  const dialog = document.getElementById('address-dialog');
  const form = document.getElementById('address-form');
  const openButton = document.getElementById('open-address');
  const number = form.elements.number;
  const noNumber = form.elements.noNumber;
  openButton.addEventListener('click', () => dialog.showModal());
  document.getElementById('cancel-address').addEventListener('click', () => dialog.close());
  noNumber.addEventListener('change', () => {
    number.disabled = noNumber.checked;
    number.required = !noNumber.checked;
  });
  form.elements.postalCode.addEventListener('input', event => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 8);
    event.target.value = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  });
  // This static view keeps the address in memory; nothing is sent or stored.
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const value = name => form.elements[name].value.trim();
    const summary = document.getElementById('address-summary');
    const recipient = document.createElement('strong');
    recipient.textContent = `${value('fullName')} | ${value('phone')}`;
    const address = document.createElement('div');
    address.textContent = [value('street'), noNumber.checked ? 'S/N' : value('number'), value('complement'), value('district'), value('city'), value('postalCode')].filter(Boolean).join(', ');
    summary.replaceChildren(recipient, address);
    openButton.textContent = 'Alterar';
    dialog.close();
  });
  dialog.showModal();
})();
