/*const formatCurrency = (number) => {
    const cyrrency = new Intl.NumberFormat('ru-RU', { //числовой формат
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2, //количество знаков после запятой
    })
    return cyrrency.format(number) 
}*/
//аналогичная запись функции числового формата
const formatCurrency = number => 
    new Intl.NumberFormat('ru-RU', { //числовой формат
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2, //количество знаков после запятой
    }).format(number) 



const navigationLinks = document.querySelectorAll('.navigation__link');
const calcElems = document.querySelectorAll('.calc');



for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', (e) => {
        e.preventDefault();
        for(let j = 0; j < calcElems.length; j++){
            if(navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
                calcElems[j].classList.add('calc_active');
                navigationLinks[i].classList.add('navigation__link_active')
            } else {
                calcElems[j].classList.remove('calc_active')
                navigationLinks[j].classList.remove('navigation__link_active')
            }
        }
    });
}

//Калькулятор АУСН
const ausn = document.querySelector('.ausn');

const formAusn = ausn.querySelector('.calc__form');
const resultTaxTotal = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', () => {
    if(formAusn.type.value === 'income') {
        calcLabelExpenses.style.display = 'none';
        resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
        formAusn.expenses.value = '';
    }
    if(formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = '';
        resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
        

    }
});

//Калькулятор для самозанятых или ИП НПД с учетом вычета

const selfEmployment = document.querySelector('.self-employment');

const formEmployment = selfEmployment.querySelector('.calc__form');
const resultTaxEmployment = selfEmployment.querySelector('.result__tax_employment');
const calcLabelCompensation = selfEmployment.querySelector('.calc__label_compensation');
const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation')
const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation')
const resultTaxResult = selfEmployment.querySelector('.result_tax_result')




//функция скрытия блока Остаток вычета
const checkCompensation = () => {
    const setDisplay = formEmployment.addCompensation.checked ? 'block' : 'none';
    calcLabelCompensation.style.display = setDisplay;

    resultBlockCompensation.forEach((elem) => {
        elem.style.display = setDisplay;
    })
};

checkCompensation(); 

formEmployment.addEventListener('input', () => {
    const resIndividual = formEmployment.income_from_individuals.value * 0.04;
    const resEntity = formEmployment.income_from_legal_entities.value * 0.06;
    checkCompensation()

    const tax = resIndividual + resEntity;
formEmployment.compensation.value = formEmployment.compensation.value > 10_000 ? 10_000 : formEmployment.compensation.value

    const benefit = formEmployment.compensation.value;
    const resBenefit = formEmployment.income_from_individuals.value * 0.01 + 
        formEmployment.income_from_legal_entities.value * 0.02;
    const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
    const finalTax = tax - (benefit - finalBenefit);


    resultTaxEmployment.textContent = formatCurrency(resIndividual + resEntity);
    resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
    resultTaxRestCompensation.textContent  = formatCurrency(finalBenefit);
    resultTaxResult.textContent  = formatCurrency(finalTax);
});


// Калькулятор ОСНО

const osno = document.querySelector('.osno');
const formOsno = osno.querySelector('.calc__form');
const resultBlockIncomeTax = osno.querySelector('.result__block_income_tax')
const resultBlockNdfl = osno.querySelectorAll('.result__block_ndfl')

formOsno.addEventListener('input', () => {
    if(formOsno.type.value === 'ip') {
        resultBlockIncomeTax.style.display = 'none';
        resultBlockNdfl.forEach((elem) => {
            elem.style.display = '';
        });
    }
    if(formOsno.type.value === 'ooo') {
        resultBlockIncomeTax.style.display = '';
        resultBlockNdfl.forEach((elem) => {
            elem.style.display = 'none';
        })
    }
});

