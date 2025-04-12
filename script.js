function getDateFromInput(id) {
    const [year, month, day] = document.getElementById(id).value.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day)); // month is 0-based
}
function countWeekdaysBetween(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) { // not Sunday (0) or Saturday (6)
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}
function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
function calculate() {
    const start = getDateFromInput('start');
    const end = getDateFromInput('end');
    const weekdaysOnly = document.getElementById('weekdaysOnly').checked;

    const resultEl = document.getElementById('result');
    const explanation = document.getElementById('explanation');

    if (!start || !end || isNaN(start) || isNaN(end)) {
        resultEl.innerText = 'Por favor, selecione duas datas.';
        explanation.classList.add('hidden');
        return;
    }

    let diffDays;

    if (weekdaysOnly) {
        diffDays = countWeekdaysBetween(start, end);
    } else {
        const diffTime = Math.abs(end - start);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both dates
    }

    resultEl.innerText = `Total: ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;

    const formattedStart = formatDateToDDMMYYYY(start);
    const formattedEnd = formatDateToDDMMYYYY(end);
    explanation.innerText =
        `De ${formattedStart} até ${formattedEnd}, incluindo o dia de início e o dia final, temos ${diffDays} dia${diffDays !== 1 ? 's' : ''}${weekdaysOnly ? ' úteis' : ''}.`;
    explanation.classList.remove('hidden');
}

function calculateNewDate() {
    const start = getDateFromInput('add-start');
    const days = parseInt(document.getElementById('daysToAdd').value);
    const operation = document.getElementById('operation').value;
    const weekdaysOnly = document.getElementById('weekdaysOnlyAdd').checked;

    const resultEl = document.getElementById('add-result');

    if (!start || isNaN(start.getTime()) || isNaN(days) || days < 1) {
        resultEl.innerText = 'Por favor, insira uma data e um número de dias.';
        return;
    }

    let resultDate = new Date(start);

    if (weekdaysOnly) {
        let remaining = days;
        while (remaining > 0) {
            resultDate.setDate(resultDate.getDate() + (operation === 'add' ? 1 : -1));
            const day = resultDate.getDay();
            if (day !== 0 && day !== 6) {
                remaining--;
            }
        }
    } else {
        resultDate.setDate(resultDate.getDate() + (operation === 'add' ? days : -days));
    }

    const formattedResult = formatDateToDDMMYYYY(resultDate);
    resultEl.innerText = `Nova data: ${formattedResult}`;
}

document.getElementById('daysToAdd').addEventListener('input', (event) => {
    const input = event.target;
    if (input.value !== '') {
        input.value = Math.max(1, parseInt(input.value));
    }
});

function showTab(tab) {
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(t => t.classList.add('hidden'));

    document.getElementById(`tab-${tab}`).classList.remove('hidden');

    const allButtons = document.querySelectorAll('.tab-button');
    allButtons.forEach(b => {
        const isActive = b.dataset.tab === tab;
        b.classList.toggle('bg-blue-600', isActive);
        b.classList.toggle('text-white', isActive);
        b.classList.toggle('bg-gray-300', !isActive);
        b.classList.toggle('text-gray-800', !isActive);
    });
}
