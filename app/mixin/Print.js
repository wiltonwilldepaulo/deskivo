import { BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'
export class Print {
    #html = null
    #destino = null
    #opcoes = {
        marginsType: 0,
        pageSize: 'A4',
        printBackground: true,
        landscape: false
    }
    //  Factory — ponto de entrada da interface fluente
    static create() {
        return new Print()
    }

}