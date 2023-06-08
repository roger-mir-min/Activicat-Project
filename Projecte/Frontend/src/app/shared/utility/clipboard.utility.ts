export async function copyStringToClipboard(str: string) {
    try {
        await navigator.clipboard.writeText(str);
        console.log('Text copiat:', str);
    } catch (err) {
        console.error('Error en copiar el text:', err);
    }
    }