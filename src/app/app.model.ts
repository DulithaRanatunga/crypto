import { CurrencyPipe } from "@angular/common/src/pipes";

export interface TransferFee {
    currency: Currency,
    ammount: number
}

export interface Exchange {
    pairs: CurrencyPair[],
    name: string,
    url: string,
    fees: TransferFee[]
}

export interface CurrencyPair {
    from: Currency,
    to: Currency,
    bid?: number,
    ask?: number,
    last?: number,
    fetchState: FetchState,
    fetchTimestamp?: Date,
}

export interface Currency {
    name: string,
    code: string,
    altCode?: string,
    type: CurrencyType,
    minerFee?: number, // How much it costs to transfer this between exchanges
    transferTime?: string, // How long it typically takes.
}

export enum FetchState {
    Loading, Error, Success
}

export enum CurrencyType {
    FIAT,
    CRYPTO
}

export class Currencies {

    static getCurrency(code: string): Currency {
        const lowerCode = code.toLowerCase()
        const currency: Currency = Currencies.ALL.find(currency => {
            return currency.code.toLowerCase() === lowerCode || (currency.altCode && currency.altCode.toLowerCase() === lowerCode);
        });
        if (!currency) {
            console.error('Could not find currency: ', code);
        }
        return currency;
    }

    static BTC: Currency = {
        code: 'BTC',
        altCode: 'XBT',
        name: "Bitcoin",
        type: CurrencyType.CRYPTO,
        minerFee: 0.001,
        transferTime: '1 hour'
    }

    static ETH: Currency = {
        code: 'ETH',
        name: "Etherium",
        type: CurrencyType.CRYPTO,
        minerFee: 0.005,
        transferTime: '12 minutes'
    }

    static AUD: Currency = {
        code: 'AUD',
        name: "Australian Dollaridoos",
        type: CurrencyType.FIAT
    }

    
    static USD: Currency = {
        code: 'USD',
        name: "USD",
        type: CurrencyType.FIAT
    }
    
    static NZD: Currency = {
        code: 'NZD',
        name: "NZD",
        type: CurrencyType.FIAT
    }

    static LTC: Currency = {
        code: 'LTC',
        name: "Litecoin",
        type: CurrencyType.CRYPTO,
        minerFee: 0.01,
        transferTime: 'Unknown'
    }

    static XRP: Currency = {
        code: 'XRP',
        name: "Ripple",
        type: CurrencyType.CRYPTO,
        minerFee: 0.005,
        transferTime: '3 minutes, unknown miner fee'
    }

    static BCH: Currency = {
        code: 'BCH',
        altCode: 'BCC',
        name: "Bitcoin Cash",
        type: CurrencyType.CRYPTO,
        minerFee: 0.001,
        transferTime: 'Unknown'
    }

    
    static ALL: Currency[] = [
        Currencies.BTC,
        Currencies.ETH,
        Currencies.AUD,
        Currencies.LTC,
        Currencies.XRP,
        Currencies.BCH,
        Currencies.NZD,
        Currencies.USD,
    ]
}