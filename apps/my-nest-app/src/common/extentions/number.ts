/* eslint-disable @typescript-eslint/no-unused-vars */
import { BigNumber } from "ethers";

interface Number {
    toBigNumber(): BigNumber
}

if (!Number.prototype.toBigNumber) {
    Number.prototype.toBigNumber = function () {
        return BigNumber.from(this);
    }
}