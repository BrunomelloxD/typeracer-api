import { Difficulty, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seeds: { content: string; difficulty: Difficulty; language: string }[] = [
    {
        content:
            'O rato roeu a roupa do rei de Roma e a rainha de raiva resolveu remendar.',
        difficulty: Difficulty.EASY,
        language: 'pt-br',
    },
    {
        content:
            'A persistência é o caminho do êxito. Pequenas conquistas diárias constroem grandes resultados ao longo do tempo.',
        difficulty: Difficulty.EASY,
        language: 'pt-br',
    },
    {
        content:
            'Programar é a arte de transformar café em código legível, testável e que entrega valor real ao usuário final.',
        difficulty: Difficulty.MEDIUM,
        language: 'pt-br',
    },
    {
        content:
            'A arquitetura de software, assim como a de edifícios, deve equilibrar forma e função. Decisões tomadas hoje moldam a manutenção amanhã.',
        difficulty: Difficulty.MEDIUM,
        language: 'pt-br',
    },
    {
        content:
            'Algoritmos eficientes não nascem prontos: emergem da combinação cuidadosa entre estruturas de dados adequadas, análise assintótica criteriosa e revisão constante de invariantes.',
        difficulty: Difficulty.HARD,
        language: 'pt-br',
    },
    {
        content:
            'Concorrência exige disciplina: estados compartilhados precisam de fronteiras explícitas, sincronização correta e contratos claros entre produtores e consumidores para evitar condições de corrida sutis.',
        difficulty: Difficulty.HARD,
        language: 'pt-br',
    },
    {
        content:
            'The quick brown fox jumps over the lazy dog while the sun sets behind the silent mountains.',
        difficulty: Difficulty.EASY,
        language: 'en',
    },
    {
        content:
            'Clean code reads like well-written prose: each function has a single purpose, each name reveals intent, and each abstraction earns its place.',
        difficulty: Difficulty.MEDIUM,
        language: 'en',
    },
    {
        content:
            'Distributed systems are fundamentally about trade-offs: consistency, availability, and partition tolerance can never be fully optimized at the same time without compromise.',
        difficulty: Difficulty.HARD,
        language: 'en',
    },
];

async function main() {
    for (const seed of seeds) {
        const exists = await prisma.text.findFirst({ where: { content: seed.content } });
        if (!exists) {
            await prisma.text.create({ data: seed });
        }
    }
    const count = await prisma.text.count();
    console.log(`Seed concluído. Total de textos: ${count}`);
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
