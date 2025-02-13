import bigDecimal from 'js-big-decimal'

export const createBd = (balance: string | number, decimal: string | number) => {
    return new bigDecimal(balance).multiply(new bigDecimal(`1e-${decimal}`))
}

export const num2Amt = (num: number) => {
    let numStr = String(num).split('.')
    numStr[0] = numStr[0].replace(/[^-.0-9]/g, '').replace(/(.)(?=(\d{3})+$)/g, '$1,')

    return numStr.join('.').replace(/[`~!@#$%^&*()_|+\-=?;:'"<>{}[]\\\|ㄱ-ㅎ|ㅏ-ㅣ-ㅢ|가-힣|a-z|A-Z]/g, '')
}

export const amt2Num = (amt: string) => {
    return parseFloat(amt.replaceAll(',', ''))
}

export const amt2Bd = (amt: string) => {
    return new bigDecimal(amt.replaceAll(',', ''))
}

export const bd2Amt = (bd: bigDecimal) => {
    return bd.getPrettyValue()
}

// const unit = ['', '만', '억', '조'];

export const simpleAmt = (amt: string) => {
    const TOTAL_DISPLAY = 7

    if (amt === '0' || amt === '0.0') return ['0', '']
    let [integral, decimal] = amt.split('.')
    let intNum = Number(integral.split(',').join(''))

    if (String(intNum).length <= 4) {
        return [`${intNum}.${(decimal || '0').slice(0, TOTAL_DISPLAY - String(intNum).length - 1)}`, '']
    }
    // 한국 단위는 10000 단위
    // let intNumList = intNum.replace(/(.)(?=(\d{4})+$)/g, '$1,').split(',');
    // return [intNumList.at(0), unit.at(intNumList.length - 1)];
    return [num2Amt(intNum), '']
}
