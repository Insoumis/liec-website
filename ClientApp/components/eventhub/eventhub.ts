import Vue from 'vue';
var eventHub = new Vue()

// 2. Sp�cifiez un fichier avec les types que vous voulez augmenter
//    Vue a le type de constructeur dans types/vue.d.ts
declare module 'vue/types/vue' {
    // 3. D�clarez l'augmentation pour Vue
    interface Vue {
        $userRoles: string[],
        $userIsConnected: boolean
    }

    interface InfoLiecViewModel {
        id: string;
        title: string;
        context: string;
        text: string;
        image: string;
        sources: string[];
        tags: string[];
        lightTheme: string;
        normalTheme: string;
        darkTheme: string;
        creationDate: string;
        theme: string;
        creator: string;
        twitterUrl: string;
        facebookUrl: string;
        instagramUrl: string;
    }

    interface OkResult {
        value: object;
    }
}

export default eventHub;