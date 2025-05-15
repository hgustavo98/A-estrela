import copy
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle

app = Flask(__name__)
CORS(app)

STATE_FILE = os.path.join(os.path.dirname(__file__), 'astar_state.pkl')

def save_state(state):
    with open(STATE_FILE, 'wb') as f:
        pickle.dump(state, f)

def load_state():
    if not os.path.exists(STATE_FILE):
        return None
    with open(STATE_FILE, 'rb') as f:
        return pickle.load(f)

def clear_state():
    if os.path.exists(STATE_FILE):
        os.remove(STATE_FILE)

class Node:
    def __init__(self):
        self.x = -1
        self.y = -1
        self.distancia_percorrida = -1
        self.fe = -1
        self.caminho = []
        self.fruta_magica = False
        self.fruta_usada = False

def encontrar_posicao(tab, letra):
    for i in range(len(tab)):
        for j in range(len(tab[0])):
            if tab[i][j] == letra:
                return (i, j)
    return None

def calcular_distancia_ate_S(x, y, pos_S):
    return ((pos_S[0] - x) ** 2 + (pos_S[1] - y) ** 2) ** 0.5

def funcao_heuristica(distancia_percorrida, aresta_pai_filho, x, y, pos_S):
    return distancia_percorrida + aresta_pai_filho + calcular_distancia_ate_S(x, y, pos_S)

def get_min(estados):
    if len(estados) == 0:
        return None
    melhor_filho = estados[0]
    indice_menor = 0
    for i in range(1, len(estados)):
        if estados[i].fe < melhor_filho.fe:
            melhor_filho = estados[i]
            indice_menor = i
    del estados[indice_menor]
    return melhor_filho

def ler_grid_txt():
    grid_path = os.path.join(os.path.dirname(__file__), 'grid.txt')
    with open(grid_path, 'r', encoding='utf-8') as f:
        linhas = f.readlines()
    grid = []
    for linha in linhas:
        # Remove comentários e linhas vazias
        linha = linha.strip()
        if not linha or linha.startswith('//'):
            continue
        grid.append([cell if cell else '_' for cell in linha.split('\t')])
    return grid

tab_default = ler_grid_txt()

def node_to_dict(node):
    return {
        'row': node.x,
        'col': node.y,
        'distanceTraveled': node.distancia_percorrida,
        'hasMagicFruit': node.fruta_magica,
        'usedMagicFruit': node.fruta_usada,
        'estimatedTotalCost': node.fe,
        'path': node.caminho,
    }

def node_to_dict_full(node):
    return {
        'x': node.x,
        'y': node.y,
        'distancia_percorrida': node.distancia_percorrida,
        'fe': node.fe,
        'caminho': node.caminho,
        'fruta_magica': node.fruta_magica,
        'fruta_usada': node.fruta_usada,
    }

def dict_to_node(d):
    node = Node()
    node.x = d['x']
    node.y = d['y']
    node.distancia_percorrida = d['distancia_percorrida']
    node.fe = d['fe']
    node.caminho = d['caminho']
    node.fruta_magica = d['fruta_magica']
    node.fruta_usada = d['fruta_usada']
    return node

@app.route('/api/start', methods=['POST'])
def start():
    data = request.get_json()
    if data and 'grid' in data:
        tab = data['grid']
    else:
        tab = copy.deepcopy(tab_default)
    pos_C = encontrar_posicao(tab, 'C')
    pos_S = encontrar_posicao(tab, 'S')
    pai = Node()
    pai.x, pai.y = pos_C
    pai.distancia_percorrida = 0
    pai.fruta_magica = False
    pai.fruta_usada = False
    pai.caminho = []
    pai.fe = funcao_heuristica(0, 0, pai.x, pai.y, pos_S)
    estados = []
    visitados = set()
    state = {
        'tab': tab,
        'pos_S': pos_S,
        'pai': node_to_dict_full(pai),
        'estados': [],
        'visitados': set(),
        'status': 'running',
    }
    save_state(state)
    return jsonify({'status': 'ok', 'node': node_to_dict(pai)})

@app.route('/api/step', methods=['POST'])
def step():
    state = load_state()
    if not state or state['status'] != 'running':
        return jsonify({'status': state['status'] if state else 'not_started'})
    pai = dict_to_node(state['pai'])
    estados = [dict_to_node(e) for e in state['estados']]
    visitados = set(tuple(v) if isinstance(v, (list, tuple)) else v for v in state['visitados'])
    tab = state['tab']
    pos_S = state['pos_S']
    movimentos = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    for dx, dy in movimentos:
        nx, ny = pai.x + dx, pai.y + dy
        if 0 <= nx < len(tab) and 0 <= ny < len(tab[0]):
            celula = tab[nx][ny]
            if celula == 'B':
                if pai.fruta_magica and not pai.fruta_usada:
                    fruta_sera_usada = True
                else:
                    continue
            else:
                fruta_sera_usada = False
            filho = Node()
            filho.x = nx
            filho.y = ny
            if celula == 'F':
                filho.fruta_magica = True
                filho.fruta_usada = pai.fruta_usada
            elif fruta_sera_usada:
                filho.fruta_magica = False
                filho.fruta_usada = True
            else:
                filho.fruta_magica = pai.fruta_magica
                filho.fruta_usada = pai.fruta_usada
            estado_id = (nx, ny, filho.fruta_magica, filho.fruta_usada)
            if estado_id in visitados:
                continue
            visitados.add(estado_id)
            filho.caminho = copy.deepcopy(pai.caminho)
            filho.caminho.append((pai.x, pai.y))
            custo = 2 if celula == 'A' else 1
            filho.distancia_percorrida = pai.distancia_percorrida + custo
            filho.fe = funcao_heuristica(
                pai.distancia_percorrida, custo, nx, ny, pos_S)
            estados.append(filho)
            if celula == 'S':
                state['status'] = 'found'
                state['pai'] = node_to_dict_full(filho)
                state['estados'] = [node_to_dict_full(e) for e in estados]
                state['visitados'] = list(visitados)
                save_state(state)
                return jsonify({
                    'status': 'found',
                    'node': node_to_dict(filho),
                    'path': filho.caminho + [(nx, ny)],
                    'distance': filho.distancia_percorrida
                })
    next_pai = get_min(estados)
    if next_pai is None:
        state['status'] = 'not_found'
        save_state(state)
        return jsonify({'status': 'not_found'})
    state['pai'] = node_to_dict_full(next_pai)
    state['estados'] = [node_to_dict_full(e) for e in estados]
    state['visitados'] = list(visitados)
    save_state(state)
    return jsonify({
        'status': 'running',
        'node': node_to_dict(next_pai),
        'visitados': list(visitados),
        'caminho': next_pai.caminho,
        'path': next_pai.caminho + [(next_pai.x, next_pai.y)],
        'distance': next_pai.distancia_percorrida
    })

@app.route('/api/reset', methods=['POST'])
def reset():
    clear_state()
    return jsonify({'status': 'reset'})

@app.route('/api/state', methods=['GET'])
def get_state():
    state = load_state()
    if not state:
        return jsonify({'status': 'not_started'})
    pai = dict_to_node(state['pai'])
    caminho = pai.caminho + [(pai.x, pai.y)] if pai.caminho else [(pai.x, pai.y)]
    return jsonify({
        'status': state['status'],
        'node': node_to_dict(pai),
        'path': caminho,
        'distance': pai.distancia_percorrida
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
