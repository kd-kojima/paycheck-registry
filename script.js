// =====================================================
// CONSTANTS
// =====================================================

const API_URI = '/data'
const PAYCHECK_TYPE = {
    'salary': '給与',
    'bonus': '賞与'
}



// =====================================================
// DATA
// =====================================================

class PayCheck {
    constructor() {
        this.id = '';
        this.type = '';
        this.year = '';
        this.month = '';
        this.workTime = {
            overtime: '',
            dayoff: '',
            midnight: ''
        };
        this.summary = {
            income: '',
            deduction: '',
        };
        this.details = {
            income: new Array({
                key: '',
                value: ''
            }),
            deduction: new Array({
                key: '',
                value: ''
            })
        };
        this.grossSalary = {
            transportationExpenses: '',
            otherTaxable: '',
            totalTaxable: '',
            employmentInsurance: ''
        };
        this.bank = {
            first: {
                name: '',
                branch: '',
                accountNumber: '',
                amount: ''
            },
            second: {
                name: '',
                branch: '',
                accountNumber: '',
                amount: ''
            }
        };
        this.note = '';
    }
    
    fromJson(jsonData) {
        this.id = jsonData.id;
        this.type = jsonData.type;
        this.year = jsonData.year;
        this.month = jsonData.month;
        this.workTime = jsonData.workTime;
        this.summary = jsonData.summary;
        this.details = jsonData.details;
        this.grossSalary = jsonData.grossSalary;
        this.bank = jsonData.bank;
        this.note = jsonData.note;

        return this;
    }

    toJson() {
        return JSON.stringify(this, null, 4);
    }

    fromForm(formElement) {
        // this.id = formElement.id.value;
        this.type = formElement.type.value;
        this.year = formElement.year.value;
        this.month = formElement.month.value;
        this.workTime = {
            overtime: formElement.overtime.value,
            dayoff: formElement.dayoff.value,
            midnight: formElement.midnight.value
        };
        this.summary = {
            income: formElement.income.value,
            deduction: formElement.deduction.value,
        };
        this.details = {
            income: formElement.incomeKeys.value.split('\n').map((key, index) => {
                return {
                    key: key,
                    value: formElement.incomeValues.value.split('\n')[index]
                };
            }),
            deduction: formElement.deductionKeys.value.split('\n').map((key, index) => {
                return {
                    key: key,
                    value: formElement.deductionValues.value.split('\n')[index]
                };
            }),
        };
        this.grossSalary = {
            transportationExpenses: formElement.transportationExpenses.value,
            otherTaxable: formElement.otherTaxable.value,
            totalTaxable: formElement.totalTaxable.value,
            employmentInsurance: formElement.employmentInsurance.value
        };
        this.bank = {
            first: {
                name: formElement.firstBankname.value,
                branch: formElement.firstBankbranch.value,
                accountNumber: formElement.firstBankAccountNumber.value,
                amount: formElement.firstBankAmount.value
            },
            second: {
                name: formElement.secondBankname.value,
                branch: formElement.secondBankbranch.value,
                accountNumber: formElement.secondBankAccountNumber.value,
                amount: formElement.secondBankAmount.value
            }
        };
        this.note = formElement.note.value;
        
        return this;
    }

    toHtml() {
        let html = `
        <div class="block">
        <div class="title">
            <span>${PAYCHECK_TYPE[this.type]}明細</span>
            <span>${this.year}年${zeroPadding(this.month, 2)}月</span>
        </div>

        <table class="workTime">
            <tr>
                <th>時間外時間</th>
                <th>休日時間</th>
                <th>深夜時間</th>
                <th></th>
                <th></th>
            </tr>
            <tr>
                <td class="amount">${this.workTime.overtime}</td>
                <td class="amount">${this.workTime.dayoff}</td>
                <td class="amount">${this.workTime.midnight}</td>
                <td class="amount"></td>
                <td class="amount"></td>
            </tr>
        </table>

        <table class="summary">
            <tr>
                <th>支給総額</th>
                <th>控除総額</th>
                <th>差引支給額</th>
            </tr>
            <tr>
                <td class="amount">${Number(this.summary.income).toLocaleString()}</td>
                <td class="amount">${Number(this.summary.deduction).toLocaleString()}</td>
                <td class="amount">${(Number(this.summary.income) - Number(this.summary.deduction)).toLocaleString()}</td>
            </tr>
        </table>

        <table class="table-with-colspan details">
            <tr>
                <th colspan="2" class="detail-cell">支給額内訳</th>
                <th colspan="2">控除額内訳</th>
            </tr>
            <tr>
                <th>項目名</th>
                <th class="amount-cell">金額</th>
                <th>項目名</th>
                <th class="amount-cell">金額</th>
            </tr>
            <tr>
                <td>${this.details.income.map((data) => {return '<div>' + data.key + '</div>';}).join('')}</td>
                <td class="amount">${this.details.income.map((data) => {return '<div>' + Number(data.value).toLocaleString() + '</div>';}).join('')}</td>
                <td>${this.details.deduction.map((data) => {return '<div>' + data.key + '</div>';}).join('')}</td>
                <td class="amount">${this.details.deduction.map((data) => {return '<div>' + Number(data.value).toLocaleString() + '</div>';}).join('')}</td>
            </tr>
        </table>

        <table class="grossSalary">
            <tr>
                <th>通勤費課税対象額</th>
                <th>その他課税対象額</th>
                <th>課税対象額合計</th>
                <th>雇用保険対象額</th>
            </tr>
            <tr>
                <td class="amount">${this.grossSalary.transportationExpenses === '' ? '' : Number(this.grossSalary.transportationExpenses).toLocaleString()}</td>
                <td class="amount">${this.grossSalary.otherTaxable === '' ? '' : Number(this.grossSalary.otherTaxable).toLocaleString()}</td>
                <td class="amount">${this.grossSalary.totalTaxable === '' ? '' : Number(this.grossSalary.totalTaxable).toLocaleString()}</td>
                <td class="amount">${this.grossSalary.employmentInsurance === '' ? '' : Number(this.grossSalary.employmentInsurance).toLocaleString()}</td>
            </tr>
        </table>

        <table class="table-with-colspan bank">
            <tr>
                <th colspan="5">振込額</th>
            </tr>
            <tr>
                <th></th>
                <th class="bank-name-cell">金融機関名</th>
                <th class="branch-name-cell">支店名</th>
                <th class="account-number-cell">口座番号</th>
                <th class="amount-cell">振込額</th>
            </tr>
            <tr>
                <th>第一口座</th>
                <td>${this.bank.first.name}</td>
                <td>${this.bank.first.branch}</td>
                <td>${this.bank.first.accountNumber}</td>
                <td class="amount">${this.bank.first.amount === '' ? '' : Number(this.bank.first.amount).toLocaleString()}</td>
            </tr>
            <tr>
                <th>第二口座</th>
                <td>${this.bank.second.name}</td>
                <td>${this.bank.second.branch}</td>
                <td>${this.bank.second.accountNumber}</td>
                <td class="amount">${this.bank.second.amount === '' ? '' : Number(this.bank.second.amount).toLocaleString()}</td>
            </tr>
            <tr>
                <th></th>
                <td></td>
                <td></td>
                <td></td>
                <td class="amount"></td>
            </tr>
        </table>

        <div class="note">
            <div class="note-title">お知らせ</div>
            <div>${this.note}</div>
        </div>
        `

        return html;
    }

    checkData() {

    }
}

// =====================================================
// COMMON TOOLS
// =====================================================

function zeroPadding(num, len) {
    return (Array(len).join('0') + num).slice(-len);
}

function enableCreateButton() {
    document.getElementById('create-button').style.display = 'inline-block';
}

function disableCreateButton() {
    document.getElementById('create-button').style.display = 'none';
}

function enableDuplicateButton(id) {
    document.getElementById('duplicate-button').style.display = 'inline-block';
    document.getElementById('duplicate-button').setAttribute('onclick', `duplicateView(${id})`);
}

function disableDuplicateButton() {
    document.getElementById('duplicate-button').style.display = 'none';
}

function enableUpdateButton(id) {
    document.getElementById('update-button').style.display = 'inline-block';
    document.getElementById('update-button').setAttribute('onclick', `updateView(${id})`);
}

function disableUpdateButton() {
    document.getElementById('update-button').style.display = 'none';
}

function enableDeleteButton(id) {
    document.getElementById('delete-button').style.display = 'inline-block';
    document.getElementById('delete-button').setAttribute('onclick', `deleteView(${id})`);
}

function disableDeleteButton() {
    document.getElementById('delete-button').style.display = 'none';
}

function enableSubmitButton() {
    document.getElementById('submit-button').style.display = 'inline-block';
}

function disableSubmitButton() {
    document.getElementById('submit-button').style.display = 'none';
}

function enableUpdateSubmitButton(id) {
    document.getElementById('update-submit-button').style.display = 'inline-block';
    document.getElementById('update-submit-button').setAttribute('onclick', `update(${id})`);
}

function disableUpdateSubmitButton() {
    document.getElementById('update-submit-button').style.display = 'none';
}

function enableCancelButton() {
    document.getElementById('cancel-button').style.display = 'inline-block';
}

function disableCancelButton() {
    document.getElementById('cancel-button').style.display = 'none';
}


// =====================================================
// CONTROLS
// =====================================================

function selectAll() {
    // Set XML Http Request
    let request = new XMLHttpRequest();

    // Call api
    request.open('GET', API_URI);
    request.responseType = 'json';
    request.send();

    // Make data
    return new Promise((resolve) => {
        request.onload = () => {
            resolve(request.response);
        }
    })
}

function select(id) {
    let request = new XMLHttpRequest();

    request.open('GET', `${API_URI}/${id}`);
    request.responseType = 'json';
    request.send()

    return new Promise((resolve) => {
        request.onload = () => {
            resolve(request.response)
        }
    })
}

function create() {
    let addDataForm = document.forms.payCheck;
    let data = new PayCheck();
    data.fromForm(addDataForm);

    // Set XML Http Request
    let request = new XMLHttpRequest();

    // Call api
    request.open('POST', API_URI);
    request.setRequestHeader("Content-type", "application/json");
    request.send(data.toJson());

    request.onload = () => {
        selectAllView();
    }
}

function update(id) {
    let updateDataForm = document.forms.payCheck;
    let data = new PayCheck();
    data.fromForm(updateDataForm);

    let request = new XMLHttpRequest();

    request.open('PUT', `${API_URI}/${id}`);
    request.setRequestHeader("Content-type", "application/json");
    request.send(data.toJson());

    request.onload = () => {
        selectAllView();
    }
}

function _delete(id) {
    let request = new XMLHttpRequest();

    request.open('DELETE', `${API_URI}/${id}`);
    request.responseType = 'json';
    request.send();

    request.onload = () => {
        selectAllView();
    }
}

// =====================================================
// VIEWS
// =====================================================

function refreshView(htmlList) {
    let oldContainer = document.getElementById('container');
    let newContainer = oldContainer.cloneNode(false);
    oldContainer.parentNode.replaceChild(newContainer, oldContainer);
    htmlList.forEach((html) => {
        newContainer.insertAdjacentHTML('beforeend', html);
    })
}


function createView() {
    let html = `
        <form name="payCheck" onsubmit="return false;">
        <div class="block">
            <div class="title">
                <select name="type" id="type" class="type-select">
                    ${
                        Object.keys(PAYCHECK_TYPE).map((key) => {
                            return '<option id="' + key + '" value="' + key + '">' + PAYCHECK_TYPE[key] + '</option>';
                        }).join('')
                    }
                </select>
                <span>明細</span>
                <input type="number" name="year" id="year" class="year-input" placeholder="yyyy">
                <span>年</span>
                <input type="number" name="month" id="month" class="month-input" placeholder="mm">
                <span>月</span>
            </div>

            <table class="workTime">
                <tr>
                    <th>時間外時間</th>
                    <th>休日時間</th>
                    <th>深夜時間</th>
                    <th></th>
                    <th></th>
                </tr>
                <tr>
                    <td class="amount">
                        <input type="text" name="overtime" id="overtime" class="cell-input">
                    </td>
                    <td class="amount">
                        <input type="text" name="dayoff" id="dayoff" class="cell-input">
                    </td>
                    <td class="amount">
                        <input type="text" name="midnight" id="midnight" class="cell-input">
                    </td>
                    <td class="amount"></td>
                    <td class="amount"></td>
                </tr>
            </table>

            <table class="summary">
                <tr>
                    <th>支給総額</th>
                    <th>控除総額</th>
                    <th>差引支給額</th>
                </tr>
                <tr>
                    <td class="amount">
                        <input type="number" name="income" id="income" class="cell-input">
                    </td>
                    <td class="amount">
                        <input type="number" name="deduction" id="deduction" class="cell-input">
                    </td>
                    <td class="amount" id="net"></td>
                </tr>
            </table>

            <table class="table-with-colspan details">
                <tr>
                    <th colspan="2">支給額内訳</th>
                    <th colspan="2">控除額内訳</th>
                </tr>
                <tr>
                    <th>項目名</th>
                    <th class="amount-cell">金額</th>
                    <th>項目名</th>
                    <th class="amount-cell">金額</th>
                </tr>
                <tr>
                    <td>
                        <textarea name="incomeKeys" id="incomeKeys" class="cell-input" placeholder="1行1項目"></textarea>
                    </td>
                    <td class="amount">
                        <textarea name="incomeValues" id="incomeValues" class="cell-input" placeholder="1行1項目"></textarea>
                    </td>
                    <td>
                        <textarea name="deductionKeys" id="deductionKeys" class="cell-input" placeholder="1行1項目"></textarea>
                    </td>
                    <td class="amount">
                        <textarea name="deductionValues" id="deductionValues" class="cell-input" placeholder="1行1項目"></textarea>
                    </td>
                </tr>
            </table>

            <table class="grossSalary">
                <tr>
                    <th>通勤費課税対象額</th>
                    <th>その他課税対象額</th>
                    <th>課税対象額合計</th>
                    <th>雇用保険対象額</th>
                </tr>
                <tr>
                    <td class="amount">
                        <input type="number" name="transportationExpenses" id="transportationExpenses" class="cell-input">
                    </td>
                    <td class="amount">
                        <input type="number" name="otherTaxable" id="otherTaxable" class="cell-input">
                    </td>
                    <td class="amount">
                        <input type="number" name="totalTaxable" id="totalTaxable" class="cell-input">
                    </td>
                    <td class="amount">
                        <input type="number" name="employmentInsurance" id="employmentInsurance" class="cell-input">
                    </td>
                </tr>
            </table>

            <table class="table-with-colspan bank">
                <tr>
                    <th colspan="5">振込額</th>
                </tr>
                <tr>
                    <th></th>
                    <th class="bank-name-cell">金融機関名</th>
                    <th class="branch-name-cell">支店名</th>
                    <th class="account-number-cell">口座番号</th>
                    <th class="amount-cell">振込額</th>
                </tr>
                <tr>
                    <th>第一口座</th>
                    <td>
                        <input type="text" name="firstBankname" id="firstBankname" class="cell-input">
                    </td>
                    <td>
                        <input type="text" name="firstBankbranch" id="firstBankbranch" class="cell-input">
                    </td>
                    <td>
                        <input type="text" name="firstBankAccountNumber" id="firstBankAccountNumber" class="cell-input">
                    </td>
                    <td class="amount">
                        <input type="number" name="firstBankAmount" id="firstBankAmount" class="cell-input">
                    </td>
                </tr>
                <tr>
                    <th>第二口座</th>
                    <td>
                        <input type="text" name="secondBankname" id="secondBankname" class="cell-input">
                    </td>
                    <td>
                        <input type="text" name="secondBankbranch" id="secondBankbranch" class="cell-input">
                    </td>
                    <td>
                        <input type="text" name="secondBankAccountNumber" id="secondBankAccountNumber" class="cell-input">
                    </td>
                    <td class="amount">
                        <input type="number" name="secondBankAmount" id="secondBankAmount" class="cell-input">
                    </td>
                </tr>
                <tr>
                    <th></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="amount"></td>
                </tr>
            </table>

            <div class="note">
                <span class="note-title">お知らせ</span>
                <div>
                    <textarea name="note" id="note" class="cell-input note-textarea"></textarea>
                </div>
            </div>
        </div> 
        </form>
    `

    refreshView([html]);
    enableCancelButton();
    enableSubmitButton();
    disableUpdateSubmitButton();
    disableCreateButton();
    disableDuplicateButton();
    disableUpdateButton();
    disableDeleteButton();
}

function selectAllView() {
    // Load data
    selectAll().then((loadedData) => {
        if (loadedData.length === 0) {
            refreshView(
                [`<div>件数: 0件</div>`]
            );
            return;
        }
        let dataList = loadedData.map((data) => {
            let paycheck = new PayCheck();
            paycheck.fromJson(data);
            return paycheck;
        });

        refreshView(dataList.map((data) => {
            return `<button onclick="selectView(${data.id})">詳細</button>${data.toHtml()}`;
        }));
    });
    disableCancelButton();
    disableSubmitButton();
    disableUpdateSubmitButton();
    enableCreateButton();
    disableDuplicateButton();
    disableUpdateButton();
    disableDeleteButton();
}

function selectView(id) {
    select(id).then((loadedData) => {
        if (loadedData.length === 0) {
            refreshView(
                [`<div>件数: 0件</div>`]
            );
            enableCancelButton();
            return;
        }
        let dataList = loadedData.map((data) => {
            let paycheck = new PayCheck();
            paycheck.fromJson(data);
            return paycheck;
        });

        refreshView(dataList.map((data) => {
            return data.toHtml();
        }));
    })
    enableCancelButton();
    disableSubmitButton();
    disableUpdateSubmitButton();
    disableCreateButton();
    enableDuplicateButton(id);
    enableUpdateButton(id);
    enableDeleteButton(id);
}

function duplicateView(id) {
    updateView(id);
    enableCancelButton();
    enableSubmitButton();
    disableUpdateSubmitButton();
    disableCreateButton();
    disableDuplicateButton();
    disableUpdateButton();
    disableDeleteButton();
}

function updateView(id) {
    createView();

    select(id).then((loadedData) => {
        if (loadedData.length === 0) {
            refreshView(
                [`<div>件数: 0件</div>`]
            );
            enableCancelButton();
            return;
        }
        loadedData.forEach((data) => {
            let paycheck = new PayCheck();
            paycheck.fromJson(data);
            
            // set default values
            document.getElementById(paycheck.type).selected = true;
            document.getElementById('year').value = paycheck.year;
            document.getElementById('month').value = paycheck.month;
            document.getElementById('overtime').value = paycheck.workTime.overtime;
            document.getElementById('dayoff').value = paycheck.workTime.dayoff;
            document.getElementById('midnight').value = paycheck.workTime.midnight;
            document.getElementById('income').value = paycheck.summary.income;
            document.getElementById('deduction').value = paycheck.summary.deduction;
            // document.getElementById('net').innerHTML = (Number(paycheck.summary.income) - Number(paycheck.summary.deduction)).toLocaleString();
            document.getElementById('incomeKeys').value = paycheck.details.income.map((x) => {
                return x.key;
            }).join('\n');
            document.getElementById('incomeValues').value = paycheck.details.income.map((x) => {
                return x.value;
            }).join('\n');
            document.getElementById('deductionKeys').value = paycheck.details.deduction.map((x) => {
                return x.key;
            }).join('\n');
            document.getElementById('deductionValues').value = paycheck.details.deduction.map((x) => {
                return x.value;
            }).join('\n');
            document.getElementById('transportationExpenses').value = paycheck.grossSalary.transportationExpenses;
            document.getElementById('otherTaxable').value = paycheck.grossSalary.otherTaxable;
            document.getElementById('totalTaxable').value = paycheck.grossSalary.totalTaxable;
            document.getElementById('employmentInsurance').value = paycheck.grossSalary.employmentInsurance;
            document.getElementById('firstBankname').value = paycheck.bank.first.name;
            document.getElementById('firstBankbranch').value = paycheck.bank.first.branch;
            document.getElementById('firstBankAccountNumber').value = paycheck.bank.first.accountNumber;
            document.getElementById('firstBankAmount').value = paycheck.bank.first.amount;
            document.getElementById('secondBankname').value = paycheck.bank.second.name;
            document.getElementById('secondBankbranch').value = paycheck.bank.second.branch;
            document.getElementById('secondBankAccountNumber').value = paycheck.bank.second.accountNumber;
            document.getElementById('secondBankAmount').value = paycheck.bank.second.amount;
            document.getElementById('note').value = paycheck.note;
        });
    })

    enableCancelButton();
    disableSubmitButton();
    enableUpdateSubmitButton(id);
    disableCreateButton();
    disableDuplicateButton();
    disableUpdateButton();
    disableDeleteButton();
}

function deleteView(id) {
    if (confirm("削除します。")) {
        _delete(id);
    } else {
        selectView(id);
    }
}

function main() {
    selectAllView();
}

main();