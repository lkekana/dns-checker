import { app, computer } from '@neutralinojs/lib';

export enum OS {
    macOS = 'darwin',
    Windows = 'win32',
    Linux = 'linux',
    Unknown = 'unknown'
}

export const getOS = async (): Promise<OS> => {
    const kernelInfo = await computer.getKernelInfo();
    if (kernelInfo.variant.toLowerCase().includes('darwin')) {
        // This is a macOS system
        return OS.macOS;
    }
    if (kernelInfo.variant.toLowerCase().includes('win')) {
        // This is a Windows system
        return OS.Windows;
    }
    if (kernelInfo.variant.toLowerCase().includes('linux')) {
        // This is a Linux system
        return OS.Linux;
    }
    return OS.Unknown;
}