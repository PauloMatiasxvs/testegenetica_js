//codigo limpado

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
//CODIGO C# que fiz primeiro como base
// Inicialização
//document.getElementById('popSize').addEventListener('input', function() {
    //document.getElementById('popSizeValue').textContent = this.value;
//});

//document.getElementById('mutationRate').addEventListener('input', function() {
    //document.getElementById('mutationRateValue').textContent = this.value;
//});

//document.getElementById('generations').addEventListener('input', function() {
    //document.getElementById('generationsValue').textContent = this.value;
//});

//initializePopulation();

//public class Besouro
//{
    //private static readonly Random rand = new Random();
    
    //public int R { get; set; }
    //public int G { get; set; }
    //public int B { get; set; }
    
    //public Besouro(int? r = null, int? g = null, int? b = null)
    //{
       // R = r ?? rand.Next(256);
       // G = g ?? rand.Next(256);
        //B = b ?? rand.Next(256);
    //}
    
    //public int Fitness => 765 - (R + G + B);
    
    //public Color Cor => Color.FromArgb(R, G, B);
//}

//public partial class Form1 : Form
//{
    //private List<Besouro> currentPopulation = new List<Besouro>();
    //private List<Besouro> selectedParents = new List<Besouro>();
   // private List<Besouro> children = new List<Besouro>();
   // private List<Besouro> mutatedChildren = new List<Besouro>();
   // private string selectedCrossover = "aritmetico";
   // private string selectedMutacao = "aleatoria";
   // private static readonly Random rand = new Random();

  // public Form1()
   // {
   //     InitializeComponent();
     //   InitializeOperators();
    //    InitializePopulation();
   //}

   // private void InitializeOperators()
  //  {
        // Configura eventos para os botões de operadores
     //   foreach (var card in Controls.OfType<Panel>().Where(p => p.Tag?.ToString() == "operator"))
      //  {
        //    card.Click += (sender, e) =>
       //     {
           //     var panel = (Panel)sender;
            //    string type = panel.Name.Contains("crossover") ? "crossover" : "mutacao";
            //    string value = panel.Tag.ToString().Split(';')[1];

                // Desseleciona outros
             //   foreach (var p in Controls.OfType<Panel>().Where(p => p.Tag?.ToString()?.StartsWith(type) == true))
               //     p.BackColor = SystemColors.Control;

               // panel.BackColor = Color.LightBlue;
                
              //  if (type == "crossover") selectedCrossover = value;
             //   else selectedMutacao = value;
           // };
      //  }
   // }

    //private void UpdateButtonStates()
    //{
       // btnSelection.Enabled = currentPopulation.Count > 0;
       // btnCrossover.Enabled = selectedParents.Count == 2;
        //btnMutation.Enabled = children.Count > 0;
    //}

    //private void DisplayPopulation(List<Besouro> population, FlowLayoutPanel container)
    //{
        //container.Controls.Clear();
        //
        //foreach (var besouro in population)
        //{
           // var panel = new Panel
           // {
               // Width = 120,
               // Height = 120,
               // BackColor = besouro.Cor,
                //BorderStyle = BorderStyle.FixedSingle
          //  };

          //  var lblInfo = new Label
         //   {
               // Text = $"R: {besouro.R}\nG: {besouro.G}\nB: {besouro.B}\nFitness: {besouro.Fitness}",
               // ForeColor = Color.White,
              //  Dock = DockStyle.Fill
           // };

            //panel.Controls.Add(lblInfo);
           // container.Controls.Add(panel);
       // }
   // }

   // private void InitializePopulation()
    //{
        //currentPopulation = Enumerable.Range(0, 4).Select(_ => new Besouro()).ToList();
       // selectedParents.Clear();
       // children.Clear();
        //mutatedChildren.Clear();
        
        //UpdateButtonStates();
        //DisplayPopulation(currentPopulation, flowCurrentPopulation);
        // Repetir para outros containers...
    //}

    // Restante dos métodos (Implementar similar ao JavaScript)
    //private void PerformSelection()
   // {
        //selectedParents = currentPopulation.OrderByDescending(b => b.Fitness).Take(2).ToList();
       // DisplayPopulation(selectedParents, flowSelectedParents);
       // UpdateButtonStates();
    //}

    //private void PerformCrossover()
    //{
        //var pai1 = selectedParents[0];
        //var pai2 = selectedParents[1];
        
        //switch (selectedCrossover)
       // {
            //case "aritmetico":
                //children.Add(new Besouro(
                    //(pai1.R + pai2.R) / 2,
                    //(pai1.G + pai2.G) / 2,
                    //(pai1.B + pai2.B) / 2));
               // break;
            // Implementar outros crossovers
       // }
        //DisplayPopulation(children, flowChildren);
       // UpdateButtonStates();
    //}

    // Implementar PerformMutation() e NextGeneration() similarmente

    // Event handlers dos botões
    //private void btnInitialize_Click(object sender, EventArgs e) => InitializePopulation();
    //private void btnSelection_Click(object sender, EventArgs e) => PerformSelection();
    // ... outros handlers
//}