/**
 * Класс включает в себя части речи русского языка, которые исключаем из выборки
 */
export class ExcludeWords {
    /**
     * Исключаем союзы из найденных слов
     */
    static excludeUnions(words: Array<string>): Array<string> {
        const unions = [
            'и', 'а', 'но', 'да', 'ни', 'то', 'или', 'хотя', 
            'однако', 'как', 'чем', 'чтобы', 'зато', 'же', 'будто',
            'также'
        ];

        return this.excludeWords(words, unions);
    }

    /**
     * Исключаем вики-специфичные слова из найденных
     */
    static excludeWikiSpecificWords(words: Array<string>): Array<string> {
        const wikiSpecificWords = [
            'примечание',
            'литература',
            'содержание',
            'править',
            'код',
            'дата',
            'ссылка',
            'описание',
            'статья',
            'проект',
            'год',
            'википедия',
            // хз что за дичь
            'систематикан',
            'викивидахизображениять',
            'викивид',
            'викисклад',
            'о'
        ];

        return this.excludeWords(words, wikiSpecificWords);
    }

    /**
     * Исключаем сокращения, типо (англ, рус)
     */
    static excludeAbbreviation(words: Array<string>): Array<string> {
        const abbreviations = [
            'англ',
            'яз',
            'мм',
            'неопр'
        ];

        return this.excludeWords(words, abbreviations);   
    }

    /**
     * Исключаем местоимения
     */
    static excludePronouns(words: Array<string>): Array<string> {
        const pronouns = [
            'я', 'ты', 'мы', 'вы', 'он', 'она', 'оно', 'они', 'себя', 'мой', 'твой',
            'наш', 'ваш', 'свой', 'кто', 'что', 'какой', 'каков', 'который', 'чей', 'сколько',
            'никто', 'ничто', 'некого', 'нечего', 'никакой', 'ничей', 'нисколько',
            'екто', 'нечто', 'некоторый', 'кто-то', 'сколько-то', 'что-либо', 'кое-кто',
            'какой-то', 'какой-либо', 'кое-какой', 'чей-то', 'чей-нибудь',
            'сам', 'самый', 'каждый', 'любой', 'всякий', 'целый', 'иной',
            'весь', 'другой', 'этот', 'тот', 'такой', 'таков', 'это',
            'тот-то', 'такой-то', 'столько', 'столько-то', 'её', 'где'
        ];

        return this.excludeWords(words, pronouns);
    }

    /**
     * Исключаем предлоги русского языка из найденных слов
     */
    static excludePrepositions(words: Array<string>): Array<string> {
        const excludeWords = [
            'из-за', 'на', 'из',
            'к', 'над', 'у',
            'в', 'за', 'под',
            'из-под', 'вокруг', 'мимо',
            'между', 'около', 'перед',
            'поперёк', 'среди', 'против',
            'подле', 'возле', 'близ',
            'вдоль', 'вне', 'внутри',
            'сквозь', 'через', 'по', 
            'до', 'накануне', 'благодаря',
            'от', 'ввиду', 'для', 'ради', 
            'без', 'насчёт', 'об',
            'про', 'с', 'и', 'во',
            'при', 'со'
        ];

        return this.excludeWords(words, excludeWords);
    }

    /**
     * Исключаем частицы из найденных слов
     */
    static excludeParticles(words: Array<string>): Array<string> {
        const particles = [
            'пусть', 'пускай', 'да', 'бы', 'б', 'бывало', 'не', 'нет', 'никак', 'ли',
            'неужели', 'разве', 'вот', 'вон', 'именно', 'прямо', 'точь-в-точь',
            'только', 'лишь', 'исключительно', 'единственно', 'как', 'даже',
            'ни', 'же', 'ведь', 'уж', 'всё-таки', 'всё'
        ];

        return this.excludeWords(words, particles);
    }

    static exclude(words: Array<string>) {
        const unions = this.excludeUnions(words);
        const prepositions = this.excludePrepositions(unions);
        const particles = this.excludeParticles(prepositions);
        const pronouns = this.excludePronouns(particles);
        const abbreviation = this.excludeAbbreviation(pronouns);

        const wiki = this.excludeWikiSpecificWords(abbreviation);

        return wiki;
    }

    /**
     * Исключаем слова, присутствующие в exclude из words
     */
    static excludeWords(words: Array<string>, exclude: Array<string>): Array<string> {
        const result = words;

        exclude.forEach(excludeWord => {
            if (result[excludeWord]) {
                delete result[excludeWord];
            }
        })

        return result;
    }
}
