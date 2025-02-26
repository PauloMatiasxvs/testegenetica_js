class Besouro {
    constructor(R = null, G = null, B = null) {
        this.R = R ?? Math.floor(Math.random() * 256);
        this.G = G ?? Math.floor(Math.random() * 256);
        this.B = B ?? Math.floor(Math.random() * 256);
    }

    get fitness() {
        return 765 - (this.R + this.G + this.B);
    }

    get color() {
        return `rgb(${this.R},${this.G},${this.B})`;
    }
}

// Estado global
let currentPopulation = [];
let selectedParents = [];
let children = [];
let mutatedChildren = [];
let selectedCrossover = 'aritmetico';
let selectedMutacao = 'aleatoria';

// Inicialização dos seletores
document.querySelectorAll('.operator-card').forEach(card => {
    card.addEventListener('click', () => {
        const type = card.dataset.type;
        const value = card.dataset.value;
        
        // Remove seleção anterior
        document.querySelectorAll(`[data-type="${type}"]`).forEach(c => 
            c.classList.remove('selected'));
        
        // Adiciona nova seleção
        card.classList.add('selected');
        
        // Atualiza variável correspondente
        if(type === 'crossover') selectedCrossover = value;
        if(type === 'mutacao') selectedMutacao = value;
    });
});

function updateButtonStates() {
    const states = {
        selectionBtn: currentPopulation.length > 0,
        crossoverBtn: selectedParents.length === 2,
        mutationBtn: children.length > 0,
        nextGenBtn: mutatedChildren.length > 0
    };

    Object.entries(states).forEach(([id, enabled]) => {
        document.getElementById(id).disabled = !enabled;
    });
}

function displayPopulation(population, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    population.forEach(individuo => {
        const div = document.createElement('div');
        div.className = 'individual-box';
        div.style.backgroundColor = individuo.color;
        div.innerHTML = `
            <span>R: ${individuo.R}</span>
            <span>G: ${individuo.G}</span>
            <span>B: ${individuo.B}</span>
            <span>Fitness: ${individuo.fitness}</span>
        `;
        container.appendChild(div);
    });
}

function initializePopulation() {
    currentPopulation = Array.from({ length: 4 }, () => new Besouro());
    selectedParents = [];
    children = [];
    mutatedChildren = [];
    updateButtonStates();
    displayPopulation(currentPopulation, 'currentPopulation');
    displayPopulation([], 'selectedParents');
    displayPopulation([], 'children');
    displayPopulation([], 'mutatedChildren');
    displayPopulation([], 'nextGeneration');
}

function performSelection() {
    const totalFitness = currentPopulation.reduce((sum, b) => sum + b.fitness, 0);
    const sorted = currentPopulation.sort((a, b) => b.fitness - a.fitness);
    selectedParents = [sorted[0], sorted[1]];
    
    updateButtonStates();
    displayPopulation(selectedParents, 'selectedParents');
}

function performCrossover() {
    const [pai1, pai2] = selectedParents;
    
    const crossovers = {
        aritmetico: () => new Besouro(
            Math.round((pai1.R + pai2.R)/2),
            Math.round((pai1.G + pai2.G)/2),
            Math.round((pai1.B + pai2.B)/2)
        ),
        
        umponto: () => {
            const point = Math.random() < 0.5 ? 'R' : 'G';
            return new Besouro(
                point === 'R' ? pai1.R : pai2.R,
                point === 'G' ? pai1.G : pai2.G,
                Math.random() < 0.5 ? pai1.B : pai2.B
            );
        },
        
        uniforme: () => new Besouro(
            Math.random() < 0.5 ? pai1.R : pai2.R,
            Math.random() < 0.5 ? pai1.G : pai2.G,
            Math.random() < 0.5 ? pai1.B : pai2.B
        )
    };
    
    children = Array.from({length: 2}, () => crossovers[selectedCrossover]());
    updateButtonStates();
    displayPopulation(children, 'children');
}

function performMutation() {
    const mutacoes = {
        aleatoria: (child) => {
            const channel = ['R','G','B'][Math.floor(Math.random()*3)];
            child[channel] = Math.floor(Math.random()*256);
            return child;
        },
        
        pequena: (child) => {
            const channel = ['R','G','B'][Math.floor(Math.random()*3)];
            child[channel] = Math.max(0, Math.min(255, 
                child[channel] + Math.floor(Math.random()*21 - 10)));
            return child;
        },
        
        dirigida: (child) => {
            const reduce = () => Math.floor(Math.random()*16 + 5);
            child.R = Math.max(0, child.R - reduce());
            child.G = Math.max(0, child.G - reduce());
            child.B = Math.max(0, child.B - reduce());
            return child;
        }
    };
    
    mutatedChildren = children.map(child => {
        const clone = new Besouro(child.R, child.G, child.B);
        return mutacoes[selectedMutacao](clone);
    });
    updateButtonStates();
    displayPopulation(mutatedChildren, 'mutatedChildren');
}

function nextGeneration() {
    currentPopulation = [...mutatedChildren, ...currentPopulation.slice(0, 2)];
    selectedParents = [];
    children = [];
    mutatedChildren = [];
    
    updateButtonStates();
    displayPopulation(currentPopulation, 'currentPopulation');
    displayPopulation(currentPopulation, 'nextGeneration');
    displayPopulation([], 'selectedParents');
    displayPopulation([], 'children');
    displayPopulation([], 'mutatedChildren');
}

// Inicialização
document.getElementById('popSize').addEventListener('input', function() {
    document.getElementById('popSizeValue').textContent = this.value;
});

document.getElementById('mutationRate').addEventListener('input', function() {
    document.getElementById('mutationRateValue').textContent = this.value;
});

document.getElementById('generations').addEventListener('input', function() {
    document.getElementById('generationsValue').textContent = this.value;
});

initializePopulation();