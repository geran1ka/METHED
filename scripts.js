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
//паттерн вызывающий задержку
const debounceTimer = (fn, msec) => {
    let lastCall = 0;
    let lastCallTimer = NaN;
    return (...arg) => {
        const previousCall = lastCall;
        lastCall = Date.now();

        if(previousCall && ((lastCall - previousCall) <= msec)) {
            clearTimeout(lastCallTimer)
        }
        lastCallTimer = setTimeout(() => {
            fn(...arg);
        }, msec)
    }
}
{//Навигация
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
}

{//Калькулятор АУСН
    const ausn = document.querySelector('.ausn');

    const formAusn = ausn.querySelector('.calc__form');
    const resultTaxTotal = ausn.querySelector('.result__tax_total');
    const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

    calcLabelExpenses.style.display = 'none';

    formAusn.addEventListener('input', debounceTimer(() => {
        const income = +formAusn.income.value;
        if(formAusn.type.value === 'income') {
            calcLabelExpenses.style.display = 'none';
            resultTaxTotal.textContent = formatCurrency(income * 0.08);
            formAusn.expenses.value = '';
        }
        if(formAusn.type.value === 'expenses') {
            const expenses = +formAusn.expenses.value;
            calcLabelExpenses.style.display = '';
            const incomeExpenses = income < expenses ? 0 : (income - expenses);
            resultTaxTotal.textContent = formatCurrency(incomeExpenses * 0.2);
            

        }
    }, 300));
}
{
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
        const setDisplay = formEmployment.addCompensation.checked ? '' : 'none';
        calcLabelCompensation.style.display = setDisplay;

        resultBlockCompensation.forEach((elem) => {
            elem.style.display = setDisplay;
        })
    };

    checkCompensation(); 

    formEmployment.addEventListener('input', debounceTimer(() => {
        const individual = +formEmployment.income_from_individuals.value;
        const entity = +formEmployment.income_from_legal_entities.value;
        const resIndividual = individual * 0.04;
        const resEntity = entity * 0.06;
        checkCompensation()

        const tax = resIndividual + resEntity;
        formEmployment.compensation.value = +formEmployment.compensation.value > 10_000 ? 10_000 : formEmployment.compensation.value

        const benefit = +formEmployment.compensation.value;
        const resBenefit = individual * 0.01 + entity * 0.02;
        const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
        const finalTax = tax - (benefit - finalBenefit);


        resultTaxEmployment.textContent = formatCurrency(resIndividual + resEntity);
        resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
        resultTaxRestCompensation.textContent  = formatCurrency(finalBenefit);
        resultTaxResult.textContent  = formatCurrency(finalTax);
}, 300));
}

{
    // Калькулятор ОСНО

    const osno = document.querySelector('.osno');
    const formOsno = osno.querySelector('.calc__form');

    const resultBlockIncomeTax = osno.querySelector('.result__block_income_tax')
    const resultBlockNdfl = osno.querySelectorAll('.result__block_ndfl')

    const resultTaxNds = osno.querySelector('.result__tax_nds');
    const resultTaxProperty = osno.querySelector('.result__tax_property');
    const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
    const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
    const resultTaxProfit = osno.querySelector('.result__tax_profit');


    const checkFormBusnises = () => {
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
    };


    formOsno.addEventListener('input', debounceTimer(() => {
        checkFormBusnises();

        const income = +formOsno.income.value;
        const expenses = +formOsno.expenses.value;
        const property = +formOsno.property.value;

        const nds = income * 0.2;
        const taxProperty = property * 0.02;
        const profit = income < expenses ? 0 : (income - expenses);
        const ndflExpensesTotal = profit * 0.13;
        const ndflTotalIncome = (income - nds) * 0.13;
        const taxProfit = profit * 0.2;

        resultTaxNds.textContent = formatCurrency(nds);
        resultTaxProperty.textContent = formatCurrency(taxProperty);
        resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
        resultTaxNdflIncome.textContent = formatCurrency(ndflTotalIncome);
        resultTaxProfit.textContent = formatCurrency(taxProfit);
    }, 300));
}
{
//Калькулятор УСН
const LIMIT = 300_000;
const usn = document.querySelector('.usn');
const formUsn = usn.querySelector('.calc__form');

const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
const calcLabelProperty = usn.querySelector('.calc__label_property');
const resultBlockProperty = usn.querySelector('.result__block_property');

const resultTaxTotal = usn.querySelector('.result__tax_total');
console.log('resultTaxTotal: ', resultTaxTotal);
const resultTaxProperty = usn.querySelector('.result__tax_property');
/*
const checkShopProperty = (typeTax) => {
    switch(typeTax) {
        case 'income': {
            calcLabelExpenses.style.display = 'none';
            calcLabelProperty.style.display = 'none';
            resultBlockProperty.style.display = 'none';

            formUsn.expenses.value = '';
            formUsn.property.value = '';

            break;
        };
        case 'ip-expenses': {
            calcLabelExpenses.style.display = '';
            calcLabelProperty.style.display = 'none';
            resultBlockProperty.style.display = 'none';

            formUsn.property.value = '';

            break;
        };
        case 'ooo-expenses': {
            calcLabelExpenses.style.display = '';
            calcLabelProperty.style.display = '';
            resultBlockProperty.style.display = '';

            break;
        };
    }
}
checkShopProperty(formUsn.typeTax.value);
*/
//переключение через объект
const typeTax = {
    'income': () => {
        calcLabelExpenses.style.display = 'none';
        calcLabelProperty.style.display = 'none';
        resultBlockProperty.style.display = 'none';

        formUsn.expenses.value = '';
        formUsn.property.value = '';
    },
    'ip-expenses': () => {
        calcLabelExpenses.style.display = '';
        calcLabelProperty.style.display = 'none';
        resultBlockProperty.style.display = 'none';

        formUsn.property.value = '';
    },
    'ooo-expenses': () => {
        calcLabelExpenses.style.display = '';
        calcLabelProperty.style.display = '';
        resultBlockProperty.style.display = '';
    },
}
const percent = {
    'income' : 0.06,
    'ip-expenses' : 0.15,
    'ooo-expenses' : 0.15,
};

typeTax[formUsn.typeTax.value]();
formUsn.addEventListener('input', debounceTimer(() => {
    typeTax[formUsn.typeTax.value]();
    
    const income = +formUsn.income.value;
    const expenses = +formUsn.expenses.value;
    const contributions = +formUsn.contributions.value;
    const property = +formUsn.property.value;

    let profit = income - contributions;

    if(formUsn.typeTax.value !== 'income') {
        profit -= expenses;
    }
    const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
    const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
    const tax = summ * percent[formUsn.typeTax.value];
    const taxProperty = property * 0.02;

    resultTaxTotal.textContent = formatCurrency(tax < 0 ? 0 : tax);
    resultTaxProperty.textContent = formatCurrency(taxProperty);
}, 300))
}

{
    //Налоговый вычет 13%

    const taxReturn = document.querySelector('.tax-return');
    
    const formTaxReturn = taxReturn.querySelector('.calc__form');
    
    const resultTaxNdflPaid = taxReturn.querySelector('.result__tax_ndfl');
    const resultTaxDesiredDeduction = taxReturn.querySelector('.result__tax_desired-deduction');
    const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');
    
   
    formTaxReturn.addEventListener('input', debounceTimer(() => {

            const expenses = +formTaxReturn.expenses.value;
            const incomeYear = +formTaxReturn.income_year.value;
            const sumExpension = +formTaxReturn.sumExpension.value;
            const ndfl = incomeYear * 0.13;
            const posibleDeduction = expenses < sumExpension ? expenses * 0.13 : sumExpension * 0.13;
            const deduction = posibleDeduction < ndfl ? posibleDeduction : ndfl;
            

            resultTaxNdflPaid.textContent = formatCurrency(ndfl);
            resultTaxDesiredDeduction.textContent = formatCurrency(posibleDeduction);
            resultTaxDeduction.textContent = formatCurrency(deduction);
        
    }, 300))
}
