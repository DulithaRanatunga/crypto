import { Currency, TransferFee } from "./app.model";

export class ApiUtils {
    static applyBuyFee(price, feePc): number {
        return price / this.pcToDecimalMultiplier(feePc);
    }

    static applySellFee(price, feePc): number {
        return price * this.pcToDecimalMultiplier(feePc);
    }

    static pcToDecimalMultiplier(percentage): number {
        return 1 - percentage / 100;
    }

    static zeroFees(currencies: Currency[]): TransferFee[] {
        return currencies.map(c => {
            return {
                currency: c,
                ammount: 0,
            }
        });
    }
}