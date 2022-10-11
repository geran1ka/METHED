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
        resultTaxTotal.textContent = formAusn.income.value * 0.08;
        formAusn.expenses.value = '';
    }
    if(formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = 'block';
        resultTaxTotal.textContent = (formAusn.income.value - formAusn.expenses.value) * 0.2;
        

    }
});

//Калькулятор для самозанятых

const selfEmployment = document.querySelector('.self-employment');

const formEmployment = selfEmployment.querySelector('.calc__form');
const resultTaxEmployment = selfEmployment.querySelector('.result__tax_employment');

formEmployment.addEventListener('input', () => {
    resultTaxEmployment.textContent = +formEmployment.income_from_individuals.value * 0.04 + 
                                    +formEmployment.income_from_legal_entities.value * 0.06;
})