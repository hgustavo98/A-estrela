import copy


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


tab = [
    ['C', '_', '_', '_', 'B', '_'],
    ['_', 'B', '_', '_', '_', '_'],
    ['_', '_', 'F', '_', '_', '_'],
    ['_', '_', '_', 'B', 'B', '_'],
    ['_', '_', '_', 'A', '_', '_'],
    ['_', '_', '_', '_', '_', 'S'],
]

pos_C = encontrar_posicao(tab, 'C')
pos_S = encontrar_posicao(tab, 'S')

pai = Node()
pai.x, pai.y = pos_C
pai.distancia_percorrida = 0
pai.fruta_magica = False
pai.fruta_usada = False
pai.caminho = []
estados = []
final = None

movimentos = [(-1, 0), (1, 0), (0, -1), (0, 1)]

visitados = set()

while True:
    for dx, dy in movimentos:
        nx, ny = pai.x + dx, pai.y + dy
        if 0 <= nx < len(tab) and 0 <= ny < len(tab[0]):
            celula = tab[nx][ny]

            # Verifica se é possível passar pela célula
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

            # Atualiza estado da fruta
            if celula == 'F':
                filho.fruta_magica = True
                filho.fruta_usada = pai.fruta_usada
            elif fruta_sera_usada:
                filho.fruta_magica = False
                filho.fruta_usada = True
            else:
                filho.fruta_magica = pai.fruta_magica
                filho.fruta_usada = pai.fruta_usada

            # Evita visitar o mesmo estado (posição + fruta)
            estado_id = (nx, ny, filho.fruta_magica, filho.fruta_usada)
            if estado_id in visitados:
                continue
            visitados.add(estado_id)

            filho.caminho = copy.deepcopy(pai.caminho)
            filho.caminho.append((pai.x, pai.y))

            if celula == 'A':
                custo = 2
            else:
                custo = 1

            filho.distancia_percorrida = pai.distancia_percorrida + custo
            filho.fe = funcao_heuristica(
                pai.distancia_percorrida, custo, nx, ny, pos_S)
            estados.append(filho)

            print("Adicionou:", (filho.x, filho.y), " fe:", round(filho.fe, 2),
                  " fruta:", filho.fruta_magica, " fruta_usada:", filho.fruta_usada)

            if celula == 'S':
                print("\n✅ Chegou ao destino (S)!")
                print("📍 Caminho:", filho.caminho + [(nx, ny)])
                print("📏 Distância percorrida:", filho.distancia_percorrida)
                exit()

    pai = get_min(estados)
    if pai is None:
        print("❌ Não foi possível encontrar o destino (S).")
        break

    print("➡️ Melhor filho selecionado:", (pai.x, pai.y), " fe:", round(pai.fe, 2),
          " fruta:", pai.fruta_magica, " fruta_usada:", pai.fruta_usada)
    print("🚶 Caminho parcial:", pai.caminho)
