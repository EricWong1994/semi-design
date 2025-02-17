/* eslint-disable @typescript-eslint/no-empty-function */

import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import isPromise from '../utils/isPromise';

export interface PopconfirmAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    setVisible: (visible: boolean) => void;
    updateConfirmLoading: (loading: boolean) => void;
    updateCancelLoading: (loading: boolean) => void;
    notifyConfirm: (e: any) => Promise<any> | void;
    notifyCancel: (e: any) => Promise<any> | void;
    notifyVisibleChange: (visible: boolean) => void;
    notifyClickOutSide: (e: any) => void;
}

export default class PopConfirmFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PopconfirmAdapter<P, S>, P, S> {

    init(): void {}

    destroy(): void {}

    handleCancel(e: any): void {
        const maybePromise = this._adapter.notifyCancel(e) as Promise<any>;
        if (isPromise(maybePromise)) {
            this._adapter.updateCancelLoading(true);
            maybePromise.then(
                (result: any) => {
                    this.handleVisibleChange(false);
                    this._adapter.updateCancelLoading(false);
                },
                (errors: any) => {
                    this._adapter.updateCancelLoading(false);
                }
            );
        } else {
            this.handleVisibleChange(false);
        }
    }

    handleConfirm(e: any): void {
        const maybePromise = this._adapter.notifyConfirm(e) as Promise<any>;
        if (isPromise(maybePromise)) {
            this._adapter.updateConfirmLoading(true);
            maybePromise.then(
                (result: any) => {
                    this._adapter.updateConfirmLoading(false);
                    this.handleVisibleChange(false);
                },
                (errors: any) => {
                    this._adapter.updateConfirmLoading(false);
                }
            );
        } else {
            this.handleVisibleChange(false);
        }
    }

    handleClickOutSide(e: any): void {
        this._adapter.notifyClickOutSide(e);
    }

    handleVisibleChange(visible: boolean): void {
        if (!this._isControlledComponent('visible')) {
            this._adapter.setVisible(visible);
        }
        this._adapter.notifyVisibleChange(visible);
    }
}
