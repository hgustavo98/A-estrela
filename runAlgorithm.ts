import { exec } from 'child_process';

const pythonScript = 'd:\\Estrela\\algorithm.py';

exec(`python ${pythonScript}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Erro ao executar o script Python: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Erro no script Python: ${stderr}`);
        return;
    }
    console.log(`Saída do script Python:\n${stdout}`);
});
