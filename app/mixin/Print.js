import { BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'
export class Print {
    #html = null
    #opcoes = {
        marginsType: 0,
        pageSize: 'A4',
        printBackground: true,
        landscape: false
    }
    //  Factory — ponto de entrada da interface fluente
    static create() {
        return new Print();
    }
    //  Define o conteúdo HTML a ser impresso
    stringHTML(html) {
        this.#html = html;
        return this;
    }
    //Abre o PDF para exibição ou impressão
    async print() { }
}