export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  category: string;
  difficulty: string;
  question: string;
  options: Option[];
  correctId: string;
  explanation?: string;
}

export const QUESTIONS: Question[] = [
  {
    "id": "HIS_H01",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Quem liderou a frota portuguesa que chegou ao Brasil em 1500?",
    "options": [
      {
        "id": "A",
        "text": "Vasco da Gama"
      },
      {
        "id": "B",
        "text": "Cristóvão Colombo"
      },
      {
        "id": "C",
        "text": "Pedro Álvares Cabral"
      },
      {
        "id": "D",
        "text": "Fernão de Magalhães"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H02",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual guerra mundial aconteceu entre 1914 e 1918?",
    "options": [
      {
        "id": "A",
        "text": "Segunda Guerra Mundial"
      },
      {
        "id": "B",
        "text": "Guerra Fria"
      },
      {
        "id": "C",
        "text": "Primeira Guerra Mundial"
      },
      {
        "id": "D",
        "text": "Guerra Franco-Prussiana"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H03",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual navio famoso afundou em 1912 após colidir com um iceberg?",
    "options": [
      {
        "id": "A",
        "text": "Lusitania"
      },
      {
        "id": "B",
        "text": "Olympic"
      },
      {
        "id": "C",
        "text": "Titanic"
      },
      {
        "id": "D",
        "text": "Britannic"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H04",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Que fato histórico marcou o Brasil no ano de 1822?",
    "options": [
      {
        "id": "A",
        "text": "Proclamação da República"
      },
      {
        "id": "B",
        "text": "Independência do Brasil"
      },
      {
        "id": "C",
        "text": "Revolução Farroupilha"
      },
      {
        "id": "D",
        "text": "Abolição da Escravidão"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "HIS_H05",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Quem foi o mártir da Inconfidência Mineira enforcado pela coroa portuguesa?",
    "options": [
      {
        "id": "A",
        "text": "Washington Luís"
      },
      {
        "id": "B",
        "text": "José Bonifácio"
      },
      {
        "id": "C",
        "text": "Joaquim José da Silva Xavier"
      },
      {
        "id": "D",
        "text": "Joaquim Nabuco"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H06",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Quem foi o primeiro presidente dos Estados Unidos?",
    "options": [
      {
        "id": "A",
        "text": "Abraham Lincoln"
      },
      {
        "id": "B",
        "text": "Thomas Jefferson"
      },
      {
        "id": "C",
        "text": "George Washington"
      },
      {
        "id": "D",
        "text": "John Adams"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H07",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Em que ano a Lei Áurea aboliu a escravidão no Brasil?",
    "options": [
      {
        "id": "A",
        "text": "1889"
      },
      {
        "id": "B",
        "text": "1822"
      },
      {
        "id": "C",
        "text": "1888"
      },
      {
        "id": "D",
        "text": "1876"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H08",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Em qual país ficava o Muro de Berlim, construído em 1961?",
    "options": [
      {
        "id": "A",
        "text": "Áustria"
      },
      {
        "id": "B",
        "text": "Polônia"
      },
      {
        "id": "C",
        "text": "Alemanha"
      },
      {
        "id": "D",
        "text": "França"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H09",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual era a nacionalidade de Napoleão Bonaparte?",
    "options": [
      {
        "id": "A",
        "text": "Italiana"
      },
      {
        "id": "B",
        "text": "Espanhola"
      },
      {
        "id": "C",
        "text": "Francesa"
      },
      {
        "id": "D",
        "text": "Inglesa"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H10",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Segundo a tradição cristã e a Bíblia, em qual cidade Jesus nasceu?",
    "options": [
      {
        "id": "A",
        "text": "Jerusalém"
      },
      {
        "id": "B",
        "text": "Nazaré"
      },
      {
        "id": "C",
        "text": "Belém"
      },
      {
        "id": "D",
        "text": "Roma"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H11",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual civilização antiga construiu as Pirâmides de Gizé?",
    "options": [
      {
        "id": "A",
        "text": "Romana"
      },
      {
        "id": "B",
        "text": "Grega"
      },
      {
        "id": "C",
        "text": "Egípcia"
      },
      {
        "id": "D",
        "text": "Mesopotâmica"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H12",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual líder indiano defendeu a independência do seu país através da não-violência?",
    "options": [
      {
        "id": "A",
        "text": "Jawaharlal Nehru"
      },
      {
        "id": "B",
        "text": "Subhas Chandra Bose"
      },
      {
        "id": "C",
        "text": "Mahatma Gandhi"
      },
      {
        "id": "D",
        "text": "Rabindranath Tagore"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H13",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual revolução teve início em 1789 e derrubou a monarquia absolutista?",
    "options": [
      {
        "id": "A",
        "text": "Revolução Industrial"
      },
      {
        "id": "B",
        "text": "Revolução Russa"
      },
      {
        "id": "C",
        "text": "Revolução Francesa"
      },
      {
        "id": "D",
        "text": "Revolução Americana"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H14",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual navegador liderou a primeira expedição europeia a chegar à América em 1492?",
    "options": [
      {
        "id": "A",
        "text": "Américo Vespúcio"
      },
      {
        "id": "B",
        "text": "Pedro Álvares Cabral"
      },
      {
        "id": "C",
        "text": "Cristóvão Colombo"
      },
      {
        "id": "D",
        "text": "Vasco da Gama"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H15",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual país financiou as caravelas de Cristóvão Colombo em 1492?",
    "options": [
      {
        "id": "A",
        "text": "Portugal"
      },
      {
        "id": "B",
        "text": "França"
      },
      {
        "id": "C",
        "text": "Espanha"
      },
      {
        "id": "D",
        "text": "Inglaterra"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H16",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Quem desenvolveu e popularizou a primeira lâmpada elétrica incandescente comercial?",
    "options": [
      {
        "id": "A",
        "text": "Nikola Tesla"
      },
      {
        "id": "B",
        "text": "Alexander Graham Bell"
      },
      {
        "id": "C",
        "text": "Thomas Edison"
      },
      {
        "id": "D",
        "text": "Benjamin Franklin"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H17",
    "category": "História",
    "difficulty": "Fácil",
    "question": "Qual moeda a França adotou para substituir o Franco na Zona do Euro?",
    "options": [
      {
        "id": "A",
        "text": "Libra"
      },
      {
        "id": "B",
        "text": "Franco Suíço"
      },
      {
        "id": "C",
        "text": "Euro"
      },
      {
        "id": "D",
        "text": "Dólar"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H18",
    "category": "História",
    "difficulty": "Médio",
    "question": "Quem foi o líder religioso dos sertanejos na Guerra de Canudos?",
    "options": [
      {
        "id": "A",
        "text": "Tiradentes"
      },
      {
        "id": "B",
        "text": "Manuel Beckman"
      },
      {
        "id": "C",
        "text": "Antônio Conselheiro"
      },
      {
        "id": "D",
        "text": "Antonio de Souza Neto"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H19",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual marco histórico inaugurou o período da Idade Contemporânea?",
    "options": [
      {
        "id": "A",
        "text": "Tomada de Constantinopla"
      },
      {
        "id": "B",
        "text": "Queda do Império Romano"
      },
      {
        "id": "C",
        "text": "Revolução Francesa"
      },
      {
        "id": "D",
        "text": "Reforma Protestante"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H20",
    "category": "História",
    "difficulty": "Médio",
    "question": "Em qual ano Dom Pedro II foi coroado imperador do Brasil no Golpe da Maioridade?",
    "options": [
      {
        "id": "A",
        "text": "1831"
      },
      {
        "id": "B",
        "text": "1889"
      },
      {
        "id": "C",
        "text": "1841"
      },
      {
        "id": "D",
        "text": "1851"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H21",
    "category": "História",
    "difficulty": "Médio",
    "question": "Quais povos habitaram e governaram a antiga Mesopotâmia?",
    "options": [
      {
        "id": "A",
        "text": "Gregos, Romanos, Gauleses e Cretenses"
      },
      {
        "id": "B",
        "text": "Persas, Fenícios, Cananeus e Hititas"
      },
      {
        "id": "C",
        "text": "Sumérios, Caldeus, Babilônios e Assírios"
      },
      {
        "id": "D",
        "text": "Toltecas, Olmecas, Maias e Incas"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H22",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual rainha teve o reinado mais longo da história do Reino Unido?",
    "options": [
      {
        "id": "A",
        "text": "Rainha Vitória"
      },
      {
        "id": "B",
        "text": "Rainha Elizabeth I"
      },
      {
        "id": "C",
        "text": "Rainha Elizabeth II"
      },
      {
        "id": "D",
        "text": "Rainha Maria I"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H23",
    "category": "História",
    "difficulty": "Médio",
    "question": "Em qual ano ocorreu a reunificação oficial da Alemanha?",
    "options": [
      {
        "id": "A",
        "text": "1989"
      },
      {
        "id": "B",
        "text": "1991"
      },
      {
        "id": "C",
        "text": "1990"
      },
      {
        "id": "D",
        "text": "1992"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H24",
    "category": "História",
    "difficulty": "Médio",
    "question": "O que melhor define o sistema absolutista europeu?",
    "options": [
      {
        "id": "A",
        "text": "Poder dividido com a sociedade"
      },
      {
        "id": "B",
        "text": "Poder parlamentar descentralizado"
      },
      {
        "id": "C",
        "text": "Poder amplamente centralizado no monarca"
      },
      {
        "id": "D",
        "text": "Poder descentralizado clerical"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H25",
    "category": "História",
    "difficulty": "Médio",
    "question": "O primeiro imperador romano, Augusto, era herdeiro de qual líder?",
    "options": [
      {
        "id": "A",
        "text": "Diógenes"
      },
      {
        "id": "B",
        "text": "Nero"
      },
      {
        "id": "C",
        "text": "Júlio César"
      },
      {
        "id": "D",
        "text": "Marco António"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H26",
    "category": "História",
    "difficulty": "Médio",
    "question": "Em qual continente a pandemia da Peste Negra fez mais vítimas no século XIV?",
    "options": [
      {
        "id": "A",
        "text": "Ásia"
      },
      {
        "id": "B",
        "text": "África"
      },
      {
        "id": "C",
        "text": "Europa"
      },
      {
        "id": "D",
        "text": "América"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H27",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual tratado de 1494 dividiu as novas terras entre Portugal e Espanha?",
    "options": [
      {
        "id": "A",
        "text": "Tratado de Versalhes"
      },
      {
        "id": "B",
        "text": "Tratado de Utrecht"
      },
      {
        "id": "C",
        "text": "Tratado de Tordesilhas"
      },
      {
        "id": "D",
        "text": "Bula Intercoetera"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H28",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual filósofo grego foi o professor e mentor de Alexandre, o Grande?",
    "options": [
      {
        "id": "A",
        "text": "Sócrates"
      },
      {
        "id": "B",
        "text": "Platão"
      },
      {
        "id": "C",
        "text": "Aristóteles"
      },
      {
        "id": "D",
        "text": "Epicuro"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H29",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual guerra (1864–1870) uniu Brasil, Argentina e Uruguai contra Solano López?",
    "options": [
      {
        "id": "A",
        "text": "Guerra da Cisplatina"
      },
      {
        "id": "B",
        "text": "Guerra dos Farrapos"
      },
      {
        "id": "C",
        "text": "Guerra do Paraguai"
      },
      {
        "id": "D",
        "text": "Guerra do Chaco"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H30",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual dinastia governou a Rússia por mais de 300 anos até a Revolução de 1917?",
    "options": [
      {
        "id": "A",
        "text": "Habsburgo"
      },
      {
        "id": "B",
        "text": "Rurik"
      },
      {
        "id": "C",
        "text": "Romanov"
      },
      {
        "id": "D",
        "text": "Bourbon"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H31",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual civilização pré-colombiana criou calendários de alta precisão astronômica?",
    "options": [
      {
        "id": "A",
        "text": "Incas"
      },
      {
        "id": "B",
        "text": "Astecas"
      },
      {
        "id": "C",
        "text": "Maias"
      },
      {
        "id": "D",
        "text": "Toltecas"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H32",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual aliança militar ocidental foi criada em 1949 contra o bloco soviético?",
    "options": [
      {
        "id": "A",
        "text": "Pacto de Varsóvia"
      },
      {
        "id": "B",
        "text": "Liga das Nações"
      },
      {
        "id": "C",
        "text": "OTAN"
      },
      {
        "id": "D",
        "text": "União Europeia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H33",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual gladiador liderou uma grande rebelião de escravizados na Roma Antiga?",
    "options": [
      {
        "id": "A",
        "text": "Graco"
      },
      {
        "id": "B",
        "text": "Cícero"
      },
      {
        "id": "C",
        "text": "Espártaco"
      },
      {
        "id": "D",
        "text": "Pompeu"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H34",
    "category": "História",
    "difficulty": "Médio",
    "question": "Qual cidade da Grécia Antiga era conhecida pela rígida disciplina militar?",
    "options": [
      {
        "id": "A",
        "text": "Atenas"
      },
      {
        "id": "B",
        "text": "Tebas"
      },
      {
        "id": "C",
        "text": "Esparta"
      },
      {
        "id": "D",
        "text": "Corinto"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H35",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual império guerreiro dominou o Oriente Médio entre os séculos IX e VII a.C.?",
    "options": [
      {
        "id": "A",
        "text": "Império Babilónico"
      },
      {
        "id": "B",
        "text": "Império Merovíngio"
      },
      {
        "id": "C",
        "text": "Império Assírio"
      },
      {
        "id": "D",
        "text": "Império Persa"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H36",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual cidade inaugurou a primeira linha de bonde sobre trilhos em 1832?",
    "options": [
      {
        "id": "A",
        "text": "Londres"
      },
      {
        "id": "B",
        "text": "Berlim"
      },
      {
        "id": "C",
        "text": "Nova York"
      },
      {
        "id": "D",
        "text": "Viena"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H37",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual foi o último país a entrar na União Europeia, em 2013?",
    "options": [
      {
        "id": "A",
        "text": "Romênia"
      },
      {
        "id": "B",
        "text": "Bulgária"
      },
      {
        "id": "C",
        "text": "Croácia"
      },
      {
        "id": "D",
        "text": "Estônia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H38",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual pacto de não agressão foi assinado entre a Alemanha Nazista e a URSS em 1939?",
    "options": [
      {
        "id": "A",
        "text": "Acordo de Munique"
      },
      {
        "id": "B",
        "text": "Tratado de Brest-Litovsk"
      },
      {
        "id": "C",
        "text": "Pacto Ribbentrop-Molotov"
      },
      {
        "id": "D",
        "text": "Conferência de Yalta"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H39",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual tratado impôs pesadas sanções à Alemanha após a Primeira Guerra Mundial?",
    "options": [
      {
        "id": "A",
        "text": "Tratado de Tordesilhas"
      },
      {
        "id": "B",
        "text": "Tratado de Utrecht"
      },
      {
        "id": "C",
        "text": "Tratado de Versalhes"
      },
      {
        "id": "D",
        "text": "Congresso de Viena"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H40",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual imperador romano legalizou o Cristianismo pelo Édito de Milão em 313 d.C.?",
    "options": [
      {
        "id": "A",
        "text": "Teodósio"
      },
      {
        "id": "B",
        "text": "Nero"
      },
      {
        "id": "C",
        "text": "Constantino"
      },
      {
        "id": "D",
        "text": "Diocleciano"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H41",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual dinastia unificou a China sob um imperador pela primeira vez no século III a.C.?",
    "options": [
      {
        "id": "A",
        "text": "Dinastia Han"
      },
      {
        "id": "B",
        "text": "Dinastia Ming"
      },
      {
        "id": "C",
        "text": "Dinastia Qin"
      },
      {
        "id": "D",
        "text": "Dinastia Tang"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H42",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual tratado de paz pôs fim à Guerra dos Trinta Anos em 1648?",
    "options": [
      {
        "id": "A",
        "text": "Tratado de Utrecht"
      },
      {
        "id": "B",
        "text": "Tratado de Versalhes"
      },
      {
        "id": "C",
        "text": "Paz de Vestfália"
      },
      {
        "id": "D",
        "text": "Tratado de Trianon"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H43",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Em qual batalha decisiva de 1815 Napoleão Bonaparte foi derrotado de vez?",
    "options": [
      {
        "id": "A",
        "text": "Batalha de Austerlitz"
      },
      {
        "id": "B",
        "text": "Batalha de Leipzig"
      },
      {
        "id": "C",
        "text": "Batalha de Waterloo"
      },
      {
        "id": "D",
        "text": "Batalha de Trafalgar"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H44",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual imperatriz russa do século XVIII expandiu o império até o Mar Negro?",
    "options": [
      {
        "id": "A",
        "text": "Maria Stuart"
      },
      {
        "id": "B",
        "text": "Isabel I"
      },
      {
        "id": "C",
        "text": "Catarina, a Grande"
      },
      {
        "id": "D",
        "text": "Ana da Rússia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H45",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual líder ex-escravizado comandou a revolta pela independência do Haiti?",
    "options": [
      {
        "id": "A",
        "text": "Jean-Jacques Dessalines"
      },
      {
        "id": "B",
        "text": "Alexandre Pétion"
      },
      {
        "id": "C",
        "text": "Toussaint Louverture"
      },
      {
        "id": "D",
        "text": "Henri Christophe"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H46",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual lei babilônica antiga ficou famosa pela regra de 'olho por olho, dente por dente'?",
    "options": [
      {
        "id": "A",
        "text": "Código de Justiniano"
      },
      {
        "id": "B",
        "text": "Lei das Doze Tábuas"
      },
      {
        "id": "C",
        "text": "Código de Hamurábi"
      },
      {
        "id": "D",
        "text": "Leis de Manu"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H47",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual conquistador espanhol liderou a invasão que destruiu o Império Inca?",
    "options": [
      {
        "id": "A",
        "text": "Hernán Cortés"
      },
      {
        "id": "B",
        "text": "Diego de Almagro"
      },
      {
        "id": "C",
        "text": "Francisco Pizarro"
      },
      {
        "id": "D",
        "text": "Vasco Núñez de Balboa"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H48",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual evento dividiu a Igreja Cristã em Católica e Ortodoxa em 1054?",
    "options": [
      {
        "id": "A",
        "text": "Reforma Protestante"
      },
      {
        "id": "B",
        "text": "Cisma do Ocidente"
      },
      {
        "id": "C",
        "text": "Cisma do Oriente"
      },
      {
        "id": "D",
        "text": "Concílio de Trento"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H49",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Como se chama a devolução do poder ao imperador no Japão em 1868?",
    "options": [
      {
        "id": "A",
        "text": "Xogunato Tokugawa"
      },
      {
        "id": "B",
        "text": "Período Kamakura"
      },
      {
        "id": "C",
        "text": "Restauração Meiji"
      },
      {
        "id": "D",
        "text": "Rebelião Satsuma"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "HIS_H50",
    "category": "História",
    "difficulty": "Difícil",
    "question": "Qual conflito no século XIX opôs o Reino Unido e a China devido ao comércio de ópio?",
    "options": [
      {
        "id": "A",
        "text": "Guerra dos Boxers"
      },
      {
        "id": "B",
        "text": "Rebelião Taiping"
      },
      {
        "id": "C",
        "text": "Guerra do Ópio"
      },
      {
        "id": "D",
        "text": "Guerra Sino-Japonesa"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G01",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual é a montanha mais alta do mundo acima do nível do mar?",
    "options": [
      {
        "id": "A",
        "text": "Mauna Kea"
      },
      {
        "id": "B",
        "text": "Dhaulagiri"
      },
      {
        "id": "C",
        "text": "Monte Everest"
      },
      {
        "id": "D",
        "text": "Pico da Neblina"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G02",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Em qual país da América do Sul fica a cidadela inca de Machu Picchu?",
    "options": [
      {
        "id": "A",
        "text": "Colômbia"
      },
      {
        "id": "B",
        "text": "Bolívia"
      },
      {
        "id": "C",
        "text": "Peru"
      },
      {
        "id": "D",
        "text": "Equador"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G03",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual país da Europa tem o mapa em formato semelhante a uma bota?",
    "options": [
      {
        "id": "A",
        "text": "Butão"
      },
      {
        "id": "B",
        "text": "Portugal"
      },
      {
        "id": "C",
        "text": "Itália"
      },
      {
        "id": "D",
        "text": "México"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G04",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual é a maior floresta tropical do planeta?",
    "options": [
      {
        "id": "A",
        "text": "Mata Atlântica"
      },
      {
        "id": "B",
        "text": "Taiga Siberiana"
      },
      {
        "id": "C",
        "text": "Floresta Amazônica"
      },
      {
        "id": "D",
        "text": "Floresta do Congo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G05",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual cidade é a capital da França?",
    "options": [
      {
        "id": "A",
        "text": "Berlim"
      },
      {
        "id": "B",
        "text": "Madrid"
      },
      {
        "id": "C",
        "text": "Paris"
      },
      {
        "id": "D",
        "text": "Roma"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G06",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual oceano banha todo o litoral leste do Brasil?",
    "options": [
      {
        "id": "A",
        "text": "Oceano Índico"
      },
      {
        "id": "B",
        "text": "Oceano Pacífico"
      },
      {
        "id": "C",
        "text": "Oceano Atlântico"
      },
      {
        "id": "D",
        "text": "Oceano Glacial Antártico"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G07",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Em qual continente fica a Guiana Francesa, vizinha do Brasil?",
    "options": [
      {
        "id": "A",
        "text": "Europa"
      },
      {
        "id": "B",
        "text": "América Central"
      },
      {
        "id": "C",
        "text": "América do Sul"
      },
      {
        "id": "D",
        "text": "África"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G08",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual linha imaginária divide a Terra nos Hemisférios Norte e Sul?",
    "options": [
      {
        "id": "A",
        "text": "Trópico de Capricórnio"
      },
      {
        "id": "B",
        "text": "Meridiano de Greenwich"
      },
      {
        "id": "C",
        "text": "Linha do Equador"
      },
      {
        "id": "D",
        "text": "Trópico de Câncer"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G09",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual é o maior país do mundo em extensão territorial?",
    "options": [
      {
        "id": "A",
        "text": "Canadá"
      },
      {
        "id": "B",
        "text": "China"
      },
      {
        "id": "C",
        "text": "Rússia"
      },
      {
        "id": "D",
        "text": "Estados Unidos"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G10",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual é o maior deserto quente do mundo, localizado no norte da África?",
    "options": [
      {
        "id": "A",
        "text": "Deserto de Gobi"
      },
      {
        "id": "B",
        "text": "Deserto de Kalahari"
      },
      {
        "id": "C",
        "text": "Deserto do Saara"
      },
      {
        "id": "D",
        "text": "Deserto do Atacama"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G11",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual país ultrapassou a China e virou o mais populoso do mundo?",
    "options": [
      {
        "id": "A",
        "text": "Indonésia"
      },
      {
        "id": "B",
        "text": "Estados Unidos"
      },
      {
        "id": "C",
        "text": "Índia"
      },
      {
        "id": "D",
        "text": "Paquistão"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G12",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual é o menor país independente do mundo, situado dentro de Roma?",
    "options": [
      {
        "id": "A",
        "text": "Mônaco"
      },
      {
        "id": "B",
        "text": "San Marino"
      },
      {
        "id": "C",
        "text": "Vaticano"
      },
      {
        "id": "D",
        "text": "Liechtenstein"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G13",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual canal na América Central conecta os oceanos Atlântico e Pacífico?",
    "options": [
      {
        "id": "A",
        "text": "Canal de Suez"
      },
      {
        "id": "B",
        "text": "Canal de Corinto"
      },
      {
        "id": "C",
        "text": "Canal do Panamá"
      },
      {
        "id": "D",
        "text": "Estreito de Bósforo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G14",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual é o maior oceano do planeta Terra em extensão?",
    "options": [
      {
        "id": "A",
        "text": "Oceano Atlântico"
      },
      {
        "id": "B",
        "text": "Oceano Índico"
      },
      {
        "id": "C",
        "text": "Oceano Pacífico"
      },
      {
        "id": "D",
        "text": "Oceano Glacial Ártico"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G15",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual país da Ásia é conhecido pelo apelido de 'Terra do Sol Nascente'?",
    "options": [
      {
        "id": "A",
        "text": "Coreia do Sul"
      },
      {
        "id": "B",
        "text": "China"
      },
      {
        "id": "C",
        "text": "Japão"
      },
      {
        "id": "D",
        "text": "Filipinas"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G16",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Qual cidade inaugurada em 1960 é a capital federal do Brasil?",
    "options": [
      {
        "id": "A",
        "text": "Rio de Janeiro"
      },
      {
        "id": "B",
        "text": "Salvador"
      },
      {
        "id": "C",
        "text": "Brasília"
      },
      {
        "id": "D",
        "text": "São Paulo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G17",
    "category": "Geografia",
    "difficulty": "Fácil",
    "question": "Quantos continentes existem na divisão tradicional ensinada no Brasil?",
    "options": [
      {
        "id": "A",
        "text": "Cinco"
      },
      {
        "id": "B",
        "text": "Sete"
      },
      {
        "id": "C",
        "text": "Seis"
      },
      {
        "id": "D",
        "text": "Oito"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G18",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual capital do norte do Brasil é famosa pelas chuvas no meio da tarde?",
    "options": [
      {
        "id": "A",
        "text": "Manaus"
      },
      {
        "id": "B",
        "text": "Macapá"
      },
      {
        "id": "C",
        "text": "Belém"
      },
      {
        "id": "D",
        "text": "Porto Velho"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G19",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Como se chama a região onde as águas escorrem para um rio principal?",
    "options": [
      {
        "id": "A",
        "text": "Lençol freático"
      },
      {
        "id": "B",
        "text": "Vale tectônico"
      },
      {
        "id": "C",
        "text": "Bacia hidrográfica"
      },
      {
        "id": "D",
        "text": "Foz em estuário"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G20",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Quais países da América do Sul são banhados pela bacia do Rio Paraná?",
    "options": [
      {
        "id": "A",
        "text": "Brasil, Uruguai e Paraguai"
      },
      {
        "id": "B",
        "text": "Brasil, Uruguai e Chile"
      },
      {
        "id": "C",
        "text": "Argentina, Brasil e Paraguai"
      },
      {
        "id": "D",
        "text": "Brasil, Bolívia e Paraguai"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G21",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual é a capital do estado do Acre?",
    "options": [
      {
        "id": "A",
        "text": "Porto Velho"
      },
      {
        "id": "B",
        "text": "Boa Vista"
      },
      {
        "id": "C",
        "text": "Rio Branco"
      },
      {
        "id": "D",
        "text": "Cruzeiro do Sul"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G22",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Por qual nome popular os Países Baixos são conhecidos no Brasil?",
    "options": [
      {
        "id": "A",
        "text": "Inglaterra"
      },
      {
        "id": "B",
        "text": "República Checa"
      },
      {
        "id": "C",
        "text": "Holanda"
      },
      {
        "id": "D",
        "text": "Bósnia e Herzegovina"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G23",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "As cidades de Braga, Faro e Guimarães pertencem a qual país europeu?",
    "options": [
      {
        "id": "A",
        "text": "Espanha"
      },
      {
        "id": "B",
        "text": "Itália"
      },
      {
        "id": "C",
        "text": "Portugal"
      },
      {
        "id": "D",
        "text": "França"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G24",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual ciência estuda as rochas, a formação e a estrutura da Terra?",
    "options": [
      {
        "id": "A",
        "text": "Climatologia"
      },
      {
        "id": "B",
        "text": "Geomorfologia"
      },
      {
        "id": "C",
        "text": "Geologia"
      },
      {
        "id": "D",
        "text": "Cartografia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G25",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual lago na Rússia possui o maior volume de água doce líquida do mundo?",
    "options": [
      {
        "id": "A",
        "text": "Lago Michigan"
      },
      {
        "id": "B",
        "text": "Mar Cáspio"
      },
      {
        "id": "C",
        "text": "Lago Baikal"
      },
      {
        "id": "D",
        "text": "Lago Vitória"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G26",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual é a capital oficial da Austrália?",
    "options": [
      {
        "id": "A",
        "text": "Brisbane"
      },
      {
        "id": "B",
        "text": "Adelaide"
      },
      {
        "id": "C",
        "text": "Camberra"
      },
      {
        "id": "D",
        "text": "Perth"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G27",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual cadeia de montanhas percorre a costa oeste da América do Sul?",
    "options": [
      {
        "id": "A",
        "text": "Montes Apalaches"
      },
      {
        "id": "B",
        "text": "Himalaia"
      },
      {
        "id": "C",
        "text": "Cordilheira dos Andes"
      },
      {
        "id": "D",
        "text": "Montes Urais"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G28",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual país do sul da Europa abriga milhares de ilhas nos mares Egeu e Jônico?",
    "options": [
      {
        "id": "A",
        "text": "Itália"
      },
      {
        "id": "B",
        "text": "Turquia"
      },
      {
        "id": "C",
        "text": "Grécia"
      },
      {
        "id": "D",
        "text": "Croácia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G29",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual estreito separa a Espanha do continente africano?",
    "options": [
      {
        "id": "A",
        "text": "Estreito de Bósforo"
      },
      {
        "id": "B",
        "text": "Estreito de Dardanelos"
      },
      {
        "id": "C",
        "text": "Estreito de Gibraltar"
      },
      {
        "id": "D",
        "text": "Estreito de Ormuz"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G30",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual país da América Central não possui exército e investe forte em ecologia?",
    "options": [
      {
        "id": "A",
        "text": "Panamá"
      },
      {
        "id": "B",
        "text": "Nicarágua"
      },
      {
        "id": "C",
        "text": "Costa Rica"
      },
      {
        "id": "D",
        "text": "Honduras"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G31",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual é a maior ilha não continental do mundo, sob posse da Dinamarca?",
    "options": [
      {
        "id": "A",
        "text": "Madagascar"
      },
      {
        "id": "B",
        "text": "Baffin"
      },
      {
        "id": "C",
        "text": "Groenlândia"
      },
      {
        "id": "D",
        "text": "Sumatra"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G32",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual cidade é a capital federal do Canadá?",
    "options": [
      {
        "id": "A",
        "text": "Toronto"
      },
      {
        "id": "B",
        "text": "Montreal"
      },
      {
        "id": "C",
        "text": "Ottawa"
      },
      {
        "id": "D",
        "text": "Vancouver"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G33",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual rio tem a bacia hidrográfica mais volumosa de água do planeta?",
    "options": [
      {
        "id": "A",
        "text": "Bacia do Congo"
      },
      {
        "id": "B",
        "text": "Bacia do Nilo"
      },
      {
        "id": "C",
        "text": "Bacia do Rio Amazonas"
      },
      {
        "id": "D",
        "text": "Bacia do Mississippi"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G34",
    "category": "Geografia",
    "difficulty": "Médio",
    "question": "Qual país tem o litoral costeiro mais extenso do mundo?",
    "options": [
      {
        "id": "A",
        "text": "Rússia"
      },
      {
        "id": "B",
        "text": "Estados Unidos"
      },
      {
        "id": "C",
        "text": "Canadá"
      },
      {
        "id": "D",
        "text": "Austrália"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G35",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual é o rio mais longo do mundo em extensão total?",
    "options": [
      {
        "id": "A",
        "text": "Rio Nilo"
      },
      {
        "id": "B",
        "text": "Rio Yangtzé"
      },
      {
        "id": "C",
        "text": "Rio Amazonas"
      },
      {
        "id": "D",
        "text": "Rio Mississippi"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G36",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual mar hiper-salino fica no ponto mais baixo da Terra em terra firme?",
    "options": [
      {
        "id": "A",
        "text": "Mar de Aral"
      },
      {
        "id": "B",
        "text": "Lago Titicaca"
      },
      {
        "id": "C",
        "text": "Mar Morto"
      },
      {
        "id": "D",
        "text": "Lago Eyre"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G37",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual é o maior país do mundo sem saída para o mar?",
    "options": [
      {
        "id": "A",
        "text": "Mongólia"
      },
      {
        "id": "B",
        "text": "Uzbequistão"
      },
      {
        "id": "C",
        "text": "Cazaquistão"
      },
      {
        "id": "D",
        "text": "Bolívia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G38",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Em quantos fusos horários diferentes se divide o território da Rússia?",
    "options": [
      {
        "id": "A",
        "text": "Nove"
      },
      {
        "id": "B",
        "text": "Dez"
      },
      {
        "id": "C",
        "text": "Onze"
      },
      {
        "id": "D",
        "text": "Doze"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G39",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual ilha do Atlântico Sul é o local habitado mais isolado do planeta?",
    "options": [
      {
        "id": "A",
        "text": "Ilha de Páscoa"
      },
      {
        "id": "B",
        "text": "Pitcairn"
      },
      {
        "id": "C",
        "text": "Tristão da Cunha"
      },
      {
        "id": "D",
        "text": "Kerguelen"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G40",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual país da África nunca foi colonizado por europeus no século XIX?",
    "options": [
      {
        "id": "A",
        "text": "Egito"
      },
      {
        "id": "B",
        "text": "Libéria"
      },
      {
        "id": "C",
        "text": "Etiópia"
      },
      {
        "id": "D",
        "text": "Somália"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G41",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual é a capital de país mais ao norte (setentrional) do mundo?",
    "options": [
      {
        "id": "A",
        "text": "Oslo"
      },
      {
        "id": "B",
        "text": "Helsinque"
      },
      {
        "id": "C",
        "text": "Reykjavik"
      },
      {
        "id": "D",
        "text": "Nuuk"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G42",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual famosa falha tectônica corta o estado da Califórnia nos EUA?",
    "options": [
      {
        "id": "A",
        "text": "Fossa das Marianas"
      },
      {
        "id": "B",
        "text": "Fenda do Rifte"
      },
      {
        "id": "C",
        "text": "Falha de San Andreas"
      },
      {
        "id": "D",
        "text": "Cordilheira Mesoatlantica"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G43",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual é o menor estado do Brasil em extensão territorial?",
    "options": [
      {
        "id": "A",
        "text": "Alagoas"
      },
      {
        "id": "B",
        "text": "Amapá"
      },
      {
        "id": "C",
        "text": "Sergipe"
      },
      {
        "id": "D",
        "text": "Espírito Santo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G44",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual arquipélago no Pacífico tem animais únicos estudados por Darwin?",
    "options": [
      {
        "id": "A",
        "text": "Ilhas Fiji"
      },
      {
        "id": "B",
        "text": "Havaí"
      },
      {
        "id": "C",
        "text": "Ilhas Galápagos"
      },
      {
        "id": "D",
        "text": "Seychelles"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G45",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual país nórdico é famoso por abrigar milhares de lagos naturais?",
    "options": [
      {
        "id": "A",
        "text": "Suécia"
      },
      {
        "id": "B",
        "text": "Noruega"
      },
      {
        "id": "C",
        "text": "Finlândia"
      },
      {
        "id": "D",
        "text": "Canadá"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G46",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual montanha é o ponto mais alto do continente africano?",
    "options": [
      {
        "id": "A",
        "text": "Monte Quênia"
      },
      {
        "id": "B",
        "text": "Monte Ruwenzori"
      },
      {
        "id": "C",
        "text": "Monte Kilimanjaro"
      },
      {
        "id": "D",
        "text": "Monte Cameroun"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G47",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual é o deserto não polar mais seco do mundo, localizado no Chile?",
    "options": [
      {
        "id": "A",
        "text": "Sonora"
      },
      {
        "id": "B",
        "text": "Mojave"
      },
      {
        "id": "C",
        "text": "Deserto do Atacama"
      },
      {
        "id": "D",
        "text": "Gobi"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G48",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual grande rio da Europa deságua no Mar Negro através de um delta na Romênia?",
    "options": [
      {
        "id": "A",
        "text": "Rio Reno"
      },
      {
        "id": "B",
        "text": "Rio Volga"
      },
      {
        "id": "C",
        "text": "Rio Danúbio"
      },
      {
        "id": "D",
        "text": "Rio Sena"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G49",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual fossa sob o gelo da Antártida é o ponto de terra firme mais profundo do mundo?",
    "options": [
      {
        "id": "A",
        "text": "Turpan"
      },
      {
        "id": "B",
        "text": "Vale da Morte"
      },
      {
        "id": "C",
        "text": "Fossa Glacial de Bentley"
      },
      {
        "id": "D",
        "text": "Vale do Jordão"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "GEO_G50",
    "category": "Geografia",
    "difficulty": "Difícil",
    "question": "Qual país é formado pelo maior arquipélago do mundo, com mais de 17 mil ilhas?",
    "options": [
      {
        "id": "A",
        "text": "Filipinas"
      },
      {
        "id": "B",
        "text": "Japão"
      },
      {
        "id": "C",
        "text": "Indonésia"
      },
      {
        "id": "D",
        "text": "Malásia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C01",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Quem patenteou e popularizou a lâmpada elétrica incandescente em 1879?",
    "options": [
      {
        "id": "A",
        "text": "Nikola Tesla"
      },
      {
        "id": "B",
        "text": "Alexander Graham Bell"
      },
      {
        "id": "C",
        "text": "Thomas Edison"
      },
      {
        "id": "D",
        "text": "Benjamin Franklin"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C02",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Quantas horas dura aproximadamente a rotação da Terra sobre o próprio eixo?",
    "options": [
      {
        "id": "A",
        "text": "365 dias"
      },
      {
        "id": "B",
        "text": "7 dias"
      },
      {
        "id": "C",
        "text": "Aproximadamente 24 horas"
      },
      {
        "id": "D",
        "text": "30 dias"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C03",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "A que temperatura a água pura ferve ao nível do mar (1 atm)?",
    "options": [
      {
        "id": "A",
        "text": "180 ºC"
      },
      {
        "id": "B",
        "text": "0 ºC"
      },
      {
        "id": "C",
        "text": "100 ºC"
      },
      {
        "id": "D",
        "text": "200 ºC"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C04",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Quais são as quatro fases principais da Lua?",
    "options": [
      {
        "id": "A",
        "text": "Nova, Cheia, Superlua e Lua de Sangue"
      },
      {
        "id": "B",
        "text": "Crescente, Minguante, Cheia e Penumbral"
      },
      {
        "id": "C",
        "text": "Nova, Crescente, Cheia e minguante"
      },
      {
        "id": "D",
        "text": "Nova, Crescente, Gibosa e Minguante"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C05",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Quantos ossos tem o esqueleto de um ser humano adulto?",
    "options": [
      {
        "id": "A",
        "text": "126"
      },
      {
        "id": "B",
        "text": "300"
      },
      {
        "id": "C",
        "text": "206"
      },
      {
        "id": "D",
        "text": "200"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C06",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual é o maior planeta do nosso Sistema Solar?",
    "options": [
      {
        "id": "A",
        "text": "Saturno"
      },
      {
        "id": "B",
        "text": "Netuno"
      },
      {
        "id": "C",
        "text": "Júpiter"
      },
      {
        "id": "D",
        "text": "Terra"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C07",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual é o planeta mais próximo do Sol?",
    "options": [
      {
        "id": "A",
        "text": "Vênus"
      },
      {
        "id": "B",
        "text": "Marte"
      },
      {
        "id": "C",
        "text": "Mercúrio"
      },
      {
        "id": "D",
        "text": "Terra"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C08",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual é a fórmula química da água?",
    "options": [
      {
        "id": "A",
        "text": "CO2"
      },
      {
        "id": "B",
        "text": "O2"
      },
      {
        "id": "C",
        "text": "H2O"
      },
      {
        "id": "D",
        "text": "NaCl"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C09",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual elemento químico vital para respirarmos tem o símbolo 'O'?",
    "options": [
      {
        "id": "A",
        "text": "Ouro"
      },
      {
        "id": "B",
        "text": "Ósmio"
      },
      {
        "id": "C",
        "text": "Oxigênio"
      },
      {
        "id": "D",
        "text": "Organessônio"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C10",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Como se chama o processo em que as plantas produzem energia usando luz solar?",
    "options": [
      {
        "id": "A",
        "text": "Respiração celular"
      },
      {
        "id": "B",
        "text": "Quimiossíntese"
      },
      {
        "id": "C",
        "text": "Fotossíntese"
      },
      {
        "id": "D",
        "text": "Transpiração"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C11",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual é o planeta mais distante do Sol no Sistema Solar?",
    "options": [
      {
        "id": "A",
        "text": "Urano"
      },
      {
        "id": "B",
        "text": "Saturno"
      },
      {
        "id": "C",
        "text": "Netuno"
      },
      {
        "id": "D",
        "text": "Plutão"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C12",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual é o maior órgão do corpo humano?",
    "options": [
      {
        "id": "A",
        "text": "Fígado"
      },
      {
        "id": "B",
        "text": "Intestino Delgado"
      },
      {
        "id": "C",
        "text": "Pele"
      },
      {
        "id": "D",
        "text": "Pulmão"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C13",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual alimento compõe quase toda a dieta do panda gigante?",
    "options": [
      {
        "id": "A",
        "text": "Eucalipto"
      },
      {
        "id": "B",
        "text": "Frutos silvestres"
      },
      {
        "id": "C",
        "text": "Bambu"
      },
      {
        "id": "D",
        "text": "Raízes"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C14",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual força invisível atrai os corpos para o centro da Terra?",
    "options": [
      {
        "id": "A",
        "text": "Magnetismo"
      },
      {
        "id": "B",
        "text": "Força Centrípuga"
      },
      {
        "id": "C",
        "text": "Gravidade"
      },
      {
        "id": "D",
        "text": "Inércia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C15",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual gás as plantas absorvem do ar para fazer a fotossíntese?",
    "options": [
      {
        "id": "A",
        "text": "Oxigênio"
      },
      {
        "id": "B",
        "text": "Metano"
      },
      {
        "id": "C",
        "text": "Dióxido de Carbono"
      },
      {
        "id": "D",
        "text": "Nitrogênio"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C16",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual é o único grupo de mamíferos capaz de voar de verdade?",
    "options": [
      {
        "id": "A",
        "text": "Esquilo-voador"
      },
      {
        "id": "B",
        "text": "Pterodáctilo"
      },
      {
        "id": "C",
        "text": "Morcegos"
      },
      {
        "id": "D",
        "text": "Ornitorrinco"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C17",
    "category": "Ciência e Natureza",
    "difficulty": "Fácil",
    "question": "Qual é a menor unidade viva fundamental dos seres vivos?",
    "options": [
      {
        "id": "A",
        "text": "Molécula"
      },
      {
        "id": "B",
        "text": "Tecido"
      },
      {
        "id": "C",
        "text": "Célula"
      },
      {
        "id": "D",
        "text": "Átomo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C18",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual é o nome popular do cloreto de sódio (NaCl) usado na comida?",
    "options": [
      {
        "id": "A",
        "text": "Bicarbonato de sódio"
      },
      {
        "id": "B",
        "text": "Vinagre"
      },
      {
        "id": "C",
        "text": "Sal de cozinha"
      },
      {
        "id": "D",
        "text": "Fermento"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C19",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual ave põe o maior ovo do reino animal atual?",
    "options": [
      {
        "id": "A",
        "text": "Condor"
      },
      {
        "id": "B",
        "text": "Albatroz"
      },
      {
        "id": "C",
        "text": "Avestruz"
      },
      {
        "id": "D",
        "text": "Ema"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C20",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual médico trata problemas de ouvido, nariz e garganta?",
    "options": [
      {
        "id": "A",
        "text": "Oftalmologia"
      },
      {
        "id": "B",
        "text": "Dermatologia"
      },
      {
        "id": "C",
        "text": "Otorrinolaringologia"
      },
      {
        "id": "D",
        "text": "Pediatria"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C21",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Quantos Megabytes (MB) formam exatamente 1 Gigabyte (GB)?",
    "options": [
      {
        "id": "A",
        "text": "Kilobyte"
      },
      {
        "id": "B",
        "text": "Terabyte"
      },
      {
        "id": "C",
        "text": "Gigabyte"
      },
      {
        "id": "D",
        "text": "Bit"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C22",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual cientista mulher ganhou dois prêmios Nobel (Física e Química)?",
    "options": [
      {
        "id": "A",
        "text": "Rosalind Franklin"
      },
      {
        "id": "B",
        "text": "Lise Meitner"
      },
      {
        "id": "C",
        "text": "Marie Curie"
      },
      {
        "id": "D",
        "text": "Irene Joliot-Curie"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C23",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual metal líquido à temperatura ambiente era usado em termômetros antigos?",
    "options": [
      {
        "id": "A",
        "text": "Chumbo"
      },
      {
        "id": "B",
        "text": "Cádmio"
      },
      {
        "id": "C",
        "text": "Mercúrio"
      },
      {
        "id": "D",
        "text": "Prata"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C24",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual substância dá a cor verde às folhas das plantas e absorve luz solar?",
    "options": [
      {
        "id": "A",
        "text": "Caroteno"
      },
      {
        "id": "B",
        "text": "Xantofila"
      },
      {
        "id": "C",
        "text": "Clorofila"
      },
      {
        "id": "D",
        "text": "Antocianina"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C25",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual estrela fica no centro do Sistema Solar e ilumina a Terra?",
    "options": [
      {
        "id": "A",
        "text": "Proxima Centauri"
      },
      {
        "id": "B",
        "text": "Sirius"
      },
      {
        "id": "C",
        "text": "O Sol"
      },
      {
        "id": "D",
        "text": "Betelgeuse"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C26",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual é a velocidade aproximada da luz no vácuo?",
    "options": [
      {
        "id": "A",
        "text": "343 m/s"
      },
      {
        "id": "B",
        "text": "1500 m/s"
      },
      {
        "id": "C",
        "text": "$3 \\times 10^8$ m/s"
      },
      {
        "id": "D",
        "text": "11.2 km/s"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C27",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual conceito de Charles Darwin explica como espécies evoluem no ambiente?",
    "options": [
      {
        "id": "A",
        "text": "Lamarckismo"
      },
      {
        "id": "B",
        "text": "Abiogênese"
      },
      {
        "id": "C",
        "text": "Seleção Natural"
      },
      {
        "id": "D",
        "text": "Mutacionismo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C28",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Quantos dentes permanentes tem uma boca adulta saudável e completa?",
    "options": [
      {
        "id": "A",
        "text": "Vinte e oito"
      },
      {
        "id": "B",
        "text": "Trinta"
      },
      {
        "id": "C",
        "text": "Trinta e dois"
      },
      {
        "id": "D",
        "text": "Trinta e seis"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C29",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual gás é o mais abundante no ar da atmosfera terrestre (cerca de 78%)?",
    "options": [
      {
        "id": "A",
        "text": "Oxigênio"
      },
      {
        "id": "B",
        "text": "Dióxido de Carbono"
      },
      {
        "id": "C",
        "text": "Nitrogênio"
      },
      {
        "id": "D",
        "text": "Argônio"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C30",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual mineral antigamente usado em telhas foi banido por causar câncer de pulmão?",
    "options": [
      {
        "id": "A",
        "text": "Quartzo"
      },
      {
        "id": "B",
        "text": "Gesso"
      },
      {
        "id": "C",
        "text": "Amianto"
      },
      {
        "id": "D",
        "text": "Mica"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C31",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Tartarugas, lagartos e jacarés pertencem a qual grupo de animais?",
    "options": [
      {
        "id": "A",
        "text": "Anfíbios"
      },
      {
        "id": "B",
        "text": "Mamíferos"
      },
      {
        "id": "C",
        "text": "Répteis"
      },
      {
        "id": "D",
        "text": "Aves"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C32",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual hormônio produzido pelo pâncreas ajuda a regular o açúcar no sangue?",
    "options": [
      {
        "id": "A",
        "text": "Glucagon"
      },
      {
        "id": "B",
        "text": "Adrenalina"
      },
      {
        "id": "C",
        "text": "Insulina"
      },
      {
        "id": "D",
        "text": "Cortisol"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C33",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual parte colorida do olho regula o tamanho da pupila?",
    "options": [
      {
        "id": "A",
        "text": "Cristalino"
      },
      {
        "id": "B",
        "text": "Retina"
      },
      {
        "id": "C",
        "text": "Íris"
      },
      {
        "id": "D",
        "text": "Córnea"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C34",
    "category": "Ciência e Natureza",
    "difficulty": "Médio",
    "question": "Qual membrana transparente fica na frente do olho cobrindo a íris?",
    "options": [
      {
        "id": "A",
        "text": "Retina"
      },
      {
        "id": "B",
        "text": "Esclera"
      },
      {
        "id": "C",
        "text": "Córnea"
      },
      {
        "id": "D",
        "text": "Coroide"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C35",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual físico formulou as leis do movimento e da gravitação no século XVII?",
    "options": [
      {
        "id": "A",
        "text": "Galileo Galilei"
      },
      {
        "id": "B",
        "text": "René Descartes"
      },
      {
        "id": "C",
        "text": "Isaac Newton"
      },
      {
        "id": "D",
        "text": "Albert Einstein"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C36",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual é o elemento químico mais leve e mais abundante no universo?",
    "options": [
      {
        "id": "A",
        "text": "Hélio"
      },
      {
        "id": "B",
        "text": "Carbono"
      },
      {
        "id": "C",
        "text": "Hidrogênio"
      },
      {
        "id": "D",
        "text": "Oxigênio"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C37",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual partícula atômica tem carga elétrica negativa e gira ao redor do núcleo?",
    "options": [
      {
        "id": "A",
        "text": "Prótons"
      },
      {
        "id": "B",
        "text": "Nêutrons"
      },
      {
        "id": "C",
        "text": "Elétrons"
      },
      {
        "id": "D",
        "text": "Quarks"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C38",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual físico publicou a famosa Teoria da Relatividade Geral em 1915?",
    "options": [
      {
        "id": "A",
        "text": "Niels Bohr"
      },
      {
        "id": "B",
        "text": "Werner Heisenberg"
      },
      {
        "id": "C",
        "text": "Albert Einstein"
      },
      {
        "id": "D",
        "text": "Max Planck"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C39",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual valor representa o Zero Absoluto na escala Celsius?",
    "options": [
      {
        "id": "A",
        "text": "-100 ºC"
      },
      {
        "id": "B",
        "text": "0 ºC"
      },
      {
        "id": "C",
        "text": "-273,15 ºC"
      },
      {
        "id": "D",
        "text": "-459,67 ºC"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C40",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual planeta possui os anéis mais brilhantes e conhecidos do Sistema Solar?",
    "options": [
      {
        "id": "A",
        "text": "Júpiter"
      },
      {
        "id": "B",
        "text": "Urano"
      },
      {
        "id": "C",
        "text": "Saturno"
      },
      {
        "id": "D",
        "text": "Netuno"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C41",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual cientista descobriu a penicilina, o primeiro antibiótico?",
    "options": [
      {
        "id": "A",
        "text": "Louis Pasteur"
      },
      {
        "id": "B",
        "text": "Robert Koch"
      },
      {
        "id": "C",
        "text": "Alexander Fleming"
      },
      {
        "id": "D",
        "text": "Edward Jenner"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C42",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual molécula em forma de dupla hélice guarda a informação genética dos seres vivos?",
    "options": [
      {
        "id": "A",
        "text": "RNAm"
      },
      {
        "id": "B",
        "text": "Histona"
      },
      {
        "id": "C",
        "text": "DNA"
      },
      {
        "id": "D",
        "text": "Ribossoma"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C43",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual ave consegue bater as asas tão rápido que pode voar para trás?",
    "options": [
      {
        "id": "A",
        "text": "Andorinha"
      },
      {
        "id": "B",
        "text": "Martin-pescador"
      },
      {
        "id": "C",
        "text": "Beija-flor"
      },
      {
        "id": "D",
        "text": "Canário"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C44",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual radiação no espaço é considerada a prova fóssil do Big Bang?",
    "options": [
      {
        "id": "A",
        "text": "Radiação Ultravioleta"
      },
      {
        "id": "B",
        "text": "Raios Cósmicos"
      },
      {
        "id": "C",
        "text": "Radiação Cósmica de Fundo"
      },
      {
        "id": "D",
        "text": "Emissões Sincrotron"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C45",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual é o mineral natural de maior dureza conhecido na Terra?",
    "options": [
      {
        "id": "A",
        "text": "Grafite"
      },
      {
        "id": "B",
        "text": "Talco"
      },
      {
        "id": "C",
        "text": "Diamante"
      },
      {
        "id": "D",
        "text": "Coríndon"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C46",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual pequena bolsa ligada ao intestino grosso pode inflamar e causar apendicite?",
    "options": [
      {
        "id": "A",
        "text": "Vesícula biliar"
      },
      {
        "id": "B",
        "text": "Baço"
      },
      {
        "id": "C",
        "text": "Apêndice cecal"
      },
      {
        "id": "D",
        "text": "Pâncreas"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C47",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Como se chama o núcleo ultra denso que sobra após uma estrela explodir em supernova?",
    "options": [
      {
        "id": "A",
        "text": "Anã Branca"
      },
      {
        "id": "B",
        "text": "Buraco Negro"
      },
      {
        "id": "C",
        "text": "Estrela de Nêutrons"
      },
      {
        "id": "D",
        "text": "Estrela de Quarks"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C48",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual isótopo radioativo é o combustível mais comum em reatores nucleares?",
    "options": [
      {
        "id": "A",
        "text": "Plutônio-239"
      },
      {
        "id": "B",
        "text": "Tório-232"
      },
      {
        "id": "C",
        "text": "Urânio-235"
      },
      {
        "id": "D",
        "text": "Rádio-226"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C49",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Como se chama a camada brilhante externa do Sol visível em eclipses totais?",
    "options": [
      {
        "id": "A",
        "text": "Fotosfera"
      },
      {
        "id": "B",
        "text": "Cromosfera"
      },
      {
        "id": "C",
        "text": "Corona"
      },
      {
        "id": "D",
        "text": "Zona Radiativa"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "CIÊ_C50",
    "category": "Ciência e Natureza",
    "difficulty": "Difícil",
    "question": "Qual célula do sistema nervoso transmite impulsos elétricos no cérebro?",
    "options": [
      {
        "id": "A",
        "text": "Astrócito"
      },
      {
        "id": "B",
        "text": "Oligodendrócito"
      },
      {
        "id": "C",
        "text": "Neurônio"
      },
      {
        "id": "D",
        "text": "Micróglia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E01",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual mineral verde tira as forças do Superman?",
    "options": [
      {
        "id": "A",
        "text": "Vibranium"
      },
      {
        "id": "B",
        "text": "Adamantium"
      },
      {
        "id": "C",
        "text": "Kryptonita"
      },
      {
        "id": "D",
        "text": "Mithril"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E02",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Quem pintou a famosa obra 'Mona Lisa'?",
    "options": [
      {
        "id": "A",
        "text": "Michelangelo"
      },
      {
        "id": "B",
        "text": "Rafael Sanzio"
      },
      {
        "id": "C",
        "text": "Leonardo da Vinci"
      },
      {
        "id": "D",
        "text": "Sandro Botticelli"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E03",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Quem é o desenhista e cartunista que criou a Turma da Mônica?",
    "options": [
      {
        "id": "A",
        "text": "Ziraldo"
      },
      {
        "id": "B",
        "text": "Angeli"
      },
      {
        "id": "C",
        "text": "Mauricio de Sousa"
      },
      {
        "id": "D",
        "text": "Laerte Coutinho"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E04",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual jogador brasileiro é consagrado no mundo todo como o 'Rei do Futebol'?",
    "options": [
      {
        "id": "A",
        "text": "Garrincha"
      },
      {
        "id": "B",
        "text": "Zico"
      },
      {
        "id": "C",
        "text": "Pelé"
      },
      {
        "id": "D",
        "text": "Romário"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E05",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual é o esporte mais popular e praticado no Brasil?",
    "options": [
      {
        "id": "A",
        "text": "Atletismo"
      },
      {
        "id": "B",
        "text": "Automobilismo"
      },
      {
        "id": "C",
        "text": "Futebol"
      },
      {
        "id": "D",
        "text": "Basquetebol"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E06",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual esporte é considerado o segundo mais vitorioso e popular do Brasil?",
    "options": [
      {
        "id": "A",
        "text": "Handebol"
      },
      {
        "id": "B",
        "text": "Futsal"
      },
      {
        "id": "C",
        "text": "Vôlei"
      },
      {
        "id": "D",
        "text": "Tênis"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E07",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual saga mágica acompanha um jovem bruxo na escola de Hogwarts?",
    "options": [
      {
        "id": "A",
        "text": "Percy Jackson"
      },
      {
        "id": "B",
        "text": "Senhor dos Anéis"
      },
      {
        "id": "C",
        "text": "Harry Potter"
      },
      {
        "id": "D",
        "text": "Crônicas de Nárnia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E08",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual personagem dos contos de fadas veste uma capa vermelha para visitar a avó?",
    "options": [
      {
        "id": "A",
        "text": "Cinderela"
      },
      {
        "id": "B",
        "text": "Branca de Neve"
      },
      {
        "id": "C",
        "text": "Chapeuzinho Vermelho"
      },
      {
        "id": "D",
        "text": "Rapunzel"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E09",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "O que representam os cinco anéis coloridos da bandeira olímpica?",
    "options": [
      {
        "id": "A",
        "text": "Cinco deuses"
      },
      {
        "id": "B",
        "text": "Argolas de ginástica"
      },
      {
        "id": "C",
        "text": "Continentes unidos"
      },
      {
        "id": "D",
        "text": "Símbolos de medalhas"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E10",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Quantas listras compõem o logotipo clássico da marca esportiva Adidas?",
    "options": [
      {
        "id": "A",
        "text": "Duas listras"
      },
      {
        "id": "B",
        "text": "Quatro listras"
      },
      {
        "id": "C",
        "text": "Três listras"
      },
      {
        "id": "D",
        "text": "Cinco listras"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E11",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual animal é o símbolo presente no logotipo dos carros da Lamborghini?",
    "options": [
      {
        "id": "A",
        "text": "Cavalo"
      },
      {
        "id": "B",
        "text": "Onça"
      },
      {
        "id": "C",
        "text": "Touro"
      },
      {
        "id": "D",
        "text": "Leopardo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E12",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "De qual país é originário o famoso bolo com recheio cremoso chamado 'petit gâteau'?",
    "options": [
      {
        "id": "A",
        "text": "Italiana"
      },
      {
        "id": "B",
        "text": "Belga"
      },
      {
        "id": "C",
        "text": "Francesa"
      },
      {
        "id": "D",
        "text": "Suíça"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E13",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Quem é o fundador do Facebook e atual líder da Meta?",
    "options": [
      {
        "id": "A",
        "text": "Steve Jobs"
      },
      {
        "id": "B",
        "text": "Bill Gates"
      },
      {
        "id": "C",
        "text": "Mark Zuckerberg"
      },
      {
        "id": "D",
        "text": "Jeff Bezos"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E14",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual é a maior plataforma de vídeos da internet, fundada em 2005?",
    "options": [
      {
        "id": "A",
        "text": "Vimeo"
      },
      {
        "id": "B",
        "text": "Dailymotion"
      },
      {
        "id": "C",
        "text": "YouTube"
      },
      {
        "id": "D",
        "text": "Twitch"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E15",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual boneca famosa foi lançada pela Mattel em 1959 e virou ícone pop?",
    "options": [
      {
        "id": "A",
        "text": "Susi"
      },
      {
        "id": "B",
        "text": "Polly Pocket"
      },
      {
        "id": "C",
        "text": "Barbie"
      },
      {
        "id": "D",
        "text": "Bratz"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E16",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual super-herói da Marvel veste uma armadura tecnológica vermelha e dourada?",
    "options": [
      {
        "id": "A",
        "text": "Capitão América"
      },
      {
        "id": "B",
        "text": "Thor"
      },
      {
        "id": "C",
        "text": "Homem de Ferro"
      },
      {
        "id": "D",
        "text": "Visão"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E17",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Fácil",
    "question": "Qual cantor americano de 'Billie Jean' e 'Thriller' é chamado de 'Rei do Pop'?",
    "options": [
      {
        "id": "A",
        "text": "Prince"
      },
      {
        "id": "B",
        "text": "Elvis Presley"
      },
      {
        "id": "C",
        "text": "Michael Jackson"
      },
      {
        "id": "D",
        "text": "Stevie Wonder"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E18",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Quem escreveu o clássico espanhol em que o herói luta contra moinhos de vento?",
    "options": [
      {
        "id": "A",
        "text": "García Márquez"
      },
      {
        "id": "B",
        "text": "Lope de Vega"
      },
      {
        "id": "C",
        "text": "Miguel de Cervantes"
      },
      {
        "id": "D",
        "text": "García Lorca"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E19",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual atriz estrelou os clássicos 'Bonequinha de Luxo' e 'A Princesa e o Plebeu'?",
    "options": [
      {
        "id": "A",
        "text": "Lauren Bacall"
      },
      {
        "id": "B",
        "text": "Sophia Loren"
      },
      {
        "id": "C",
        "text": "Audrey Hepburn"
      },
      {
        "id": "D",
        "text": "Vivien Leigh"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E20",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual é a cor real da caixa-preta dos aviões comerciais para facilitar as buscas?",
    "options": [
      {
        "id": "A",
        "text": "Amarelo"
      },
      {
        "id": "B",
        "text": "Vermelho"
      },
      {
        "id": "C",
        "text": "Laranja"
      },
      {
        "id": "D",
        "text": "Azul"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E21",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Como se chama quem nasce na cidade do Rio de Janeiro?",
    "options": [
      {
        "id": "A",
        "text": "Fluminense"
      },
      {
        "id": "B",
        "text": "Rio-grandense"
      },
      {
        "id": "C",
        "text": "Carioca"
      },
      {
        "id": "D",
        "text": "Paulistano"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E22",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual instrumento musical de quatro cordas com arco é o mais agudo da orquestra?",
    "options": [
      {
        "id": "A",
        "text": "Harpa"
      },
      {
        "id": "B",
        "text": "Violão"
      },
      {
        "id": "C",
        "text": "Violino"
      },
      {
        "id": "D",
        "text": "Violoncelo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E23",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Como se chama o lugar público onde as pessoas vão ler e pegar livros emprestados?",
    "options": [
      {
        "id": "A",
        "text": "Livraria"
      },
      {
        "id": "B",
        "text": "Pinacoteca"
      },
      {
        "id": "C",
        "text": "Biblioteca"
      },
      {
        "id": "D",
        "text": "Hemeroteca"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E24",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual cantor brasileiro cantava grandes sucessos do soul como 'Gostava Tanto de Você'?",
    "options": [
      {
        "id": "A",
        "text": "Jorge Ben Jor"
      },
      {
        "id": "B",
        "text": "Wilson Simonal"
      },
      {
        "id": "C",
        "text": "Tim Maia"
      },
      {
        "id": "D",
        "text": "Cassiano"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E25",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual grande festa popular brasileira acontece nas ruas antes da Quaresma?",
    "options": [
      {
        "id": "A",
        "text": "Festa Junina"
      },
      {
        "id": "B",
        "text": "Festival de Parintins"
      },
      {
        "id": "C",
        "text": "Carnaval"
      },
      {
        "id": "D",
        "text": "Folia de Reis"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E26",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual festival gigante de música foi criado no Rio de Janeiro em 1985?",
    "options": [
      {
        "id": "A",
        "text": "Lollapalooza"
      },
      {
        "id": "B",
        "text": "Hollywood Rock"
      },
      {
        "id": "C",
        "text": "Rock in Rio"
      },
      {
        "id": "D",
        "text": "Planeta Atlântida"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E27",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual diretor de cinema dirigiu clássicos como 'E.T.' e 'Jurassic Park'?",
    "options": [
      {
        "id": "A",
        "text": "Martin Scorsese"
      },
      {
        "id": "B",
        "text": "George Lucas"
      },
      {
        "id": "C",
        "text": "Steven Spielberg"
      },
      {
        "id": "D",
        "text": "James Cameron"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E28",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual personagem da Disney estreou em 1928 no curta sonoro 'Steamboat Willie'?",
    "options": [
      {
        "id": "A",
        "text": "Pato Donald"
      },
      {
        "id": "B",
        "text": "Gato Félix"
      },
      {
        "id": "C",
        "text": "Mickey Mouse"
      },
      {
        "id": "D",
        "text": "Pernalonga"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E29",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual banda de rock britânica era liderada pelo cantor Freddie Mercury?",
    "options": [
      {
        "id": "A",
        "text": "The Beatles"
      },
      {
        "id": "B",
        "text": "Led Zeppelin"
      },
      {
        "id": "C",
        "text": "Queen"
      },
      {
        "id": "D",
        "text": "Pink Floyd"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E30",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual astro de Hollywood é famoso por dispensar dublês na franquia 'Missão Impossível'?",
    "options": [
      {
        "id": "A",
        "text": "Brad Pitt"
      },
      {
        "id": "B",
        "text": "Keanu Reeves"
      },
      {
        "id": "C",
        "text": "Tom Cruise"
      },
      {
        "id": "D",
        "text": "Harrison Ford"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E31",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Quem é a autora que criou a saga literária de Harry Potter?",
    "options": [
      {
        "id": "A",
        "text": "Agatha Christie"
      },
      {
        "id": "B",
        "text": "Enid Blyton"
      },
      {
        "id": "C",
        "text": "J.K. Rowling"
      },
      {
        "id": "D",
        "text": "Virginia Woolf"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E32",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual série clássica dos anos 90 acompanha seis amigos que se encontram no Central Perk?",
    "options": [
      {
        "id": "A",
        "text": "Seinfeld"
      },
      {
        "id": "B",
        "text": "How I Met Your Mother"
      },
      {
        "id": "C",
        "text": "Friends"
      },
      {
        "id": "D",
        "text": "The Big Bang Theory"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E33",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual lendário cantor jamaicano levou a música reggae e a paz para o mundo?",
    "options": [
      {
        "id": "A",
        "text": "Peter Tosh"
      },
      {
        "id": "B",
        "text": "Jimmy Cliff"
      },
      {
        "id": "C",
        "text": "Bob Marley"
      },
      {
        "id": "D",
        "text": "Burning Spear"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E34",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Médio",
    "question": "Qual é o nome verdadeiro do herói Batman por trás da máscara?",
    "options": [
      {
        "id": "A",
        "text": "Clark Kent"
      },
      {
        "id": "B",
        "text": "Tony Stark"
      },
      {
        "id": "C",
        "text": "Bruce Wayne"
      },
      {
        "id": "D",
        "text": "Peter Parker"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E35",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual prédio em Dubai é considerado o arranha-céu mais alto do mundo?",
    "options": [
      {
        "id": "A",
        "text": "Shanghai Tower"
      },
      {
        "id": "B",
        "text": "One World Trade Center"
      },
      {
        "id": "C",
        "text": "Burj Khalifa"
      },
      {
        "id": "D",
        "text": "Taipei 101"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E36",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual artista espanhol foi um dos principais fundadores do Cubismo?",
    "options": [
      {
        "id": "A",
        "text": "Salvador Dalí"
      },
      {
        "id": "B",
        "text": "Claude Monet"
      },
      {
        "id": "C",
        "text": "Pablo Picasso"
      },
      {
        "id": "D",
        "text": "Henri Matisse"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E37",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Em qual país foram realizados os primeiros Jogos Olímpicos da Era Moderna em 1896?",
    "options": [
      {
        "id": "A",
        "text": "França"
      },
      {
        "id": "B",
        "text": "Itália"
      },
      {
        "id": "C",
        "text": "Grécia"
      },
      {
        "id": "D",
        "text": "Reino Unido"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E38",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Quem pintou a célebre tela pós-impressionista 'A Noite Estrelada'?",
    "options": [
      {
        "id": "A",
        "text": "Paul Gauguin"
      },
      {
        "id": "B",
        "text": "Rembrandt"
      },
      {
        "id": "C",
        "text": "Vincent van Gogh"
      },
      {
        "id": "D",
        "text": "Johannes Vermeer"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E39",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual filme de ficção científica de 1982 virou um clássico do estilo cyberpunk?",
    "options": [
      {
        "id": "A",
        "text": "Matrix"
      },
      {
        "id": "B",
        "text": "Tron"
      },
      {
        "id": "C",
        "text": "Blade Runner"
      },
      {
        "id": "D",
        "text": "Alien"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E40",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual gênio da música clássica austríaca compôs a ópera 'A Flauta Mágica'?",
    "options": [
      {
        "id": "A",
        "text": "Ludwig van Beethoven"
      },
      {
        "id": "B",
        "text": "Johann Sebastian Bach"
      },
      {
        "id": "C",
        "text": "Wolfgang Amadeus Mozart"
      },
      {
        "id": "D",
        "text": "Franz Schubert"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E41",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual trilogia de livros épicos de J.R.R. Tolkien narra a missão de destruir o Um Anel?",
    "options": [
      {
        "id": "A",
        "text": "As Crônicas de Nárnia"
      },
      {
        "id": "B",
        "text": "O Hobbit"
      },
      {
        "id": "C",
        "text": "O Senhor dos Anéis"
      },
      {
        "id": "D",
        "text": "O Silmarillion"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E42",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual pintor norueguês pintou o famoso quadro expressionista 'O Grito'?",
    "options": [
      {
        "id": "A",
        "text": "Gustav Klimt"
      },
      {
        "id": "B",
        "text": "Egon Schiele"
      },
      {
        "id": "C",
        "text": "Edvard Munch"
      },
      {
        "id": "D",
        "text": "Wassily Kandinsky"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E43",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual ator conquistou o Oscar póstumo de 2008 pelo marcante papel do Coringa?",
    "options": [
      {
        "id": "A",
        "text": "Joaquin Phoenix"
      },
      {
        "id": "B",
        "text": "Jack Nicholson"
      },
      {
        "id": "C",
        "text": "Heath Ledger"
      },
      {
        "id": "D",
        "text": "Jared Leto"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E44",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual lendária cantora americana de jazz era chamada de 'Lady Day'?",
    "options": [
      {
        "id": "A",
        "text": "Ella Fitzgerald"
      },
      {
        "id": "B",
        "text": "Sarah Vaughan"
      },
      {
        "id": "C",
        "text": "Billie Holiday"
      },
      {
        "id": "D",
        "text": "Nina Simone"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E45",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual dramaturgo inglês escreveu as tragédias clássicas 'Romeu e Julieta' e 'Hamlet'?",
    "options": [
      {
        "id": "A",
        "text": "Geoffrey Chaucer"
      },
      {
        "id": "B",
        "text": "Christopher Marlowe"
      },
      {
        "id": "C",
        "text": "William Shakespeare"
      },
      {
        "id": "D",
        "text": "John Milton"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E46",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual arquiteto brasileiro desenhou as curvas e prédios monumentais de Brasília?",
    "options": [
      {
        "id": "A",
        "text": "Lúcio Costa"
      },
      {
        "id": "B",
        "text": "Roberto Burle Marx"
      },
      {
        "id": "C",
        "text": "Oscar Niemeyer"
      },
      {
        "id": "D",
        "text": "Paulo Mendes da Rocha"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E47",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual famosa pintura de Michelangelo decora o teto da Capela Sistina no Vaticano?",
    "options": [
      {
        "id": "A",
        "text": "O Juízo Final"
      },
      {
        "id": "B",
        "text": "A Escola de Atenas"
      },
      {
        "id": "C",
        "text": "A Criação de Adão"
      },
      {
        "id": "D",
        "text": "A Última Ceia"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E48",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Em qual país europeu floresceu o movimento cultural e artístico do Renascimento?",
    "options": [
      {
        "id": "A",
        "text": "Espanha"
      },
      {
        "id": "B",
        "text": "França"
      },
      {
        "id": "C",
        "text": "Itália"
      },
      {
        "id": "D",
        "text": "Países Baixos"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E49",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual diretor americano comandou as filmagens do clássico 'O Poderoso Chefão'?",
    "options": [
      {
        "id": "A",
        "text": "Martin Scorsese"
      },
      {
        "id": "B",
        "text": "Stanley Kubrick"
      },
      {
        "id": "C",
        "text": "Francis Ford Coppola"
      },
      {
        "id": "D",
        "text": "Brian De Palma"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "ENT_E50",
    "category": "Entretenimento e Cultura Pop",
    "difficulty": "Difícil",
    "question": "Qual escritor brasileiro escreveu 'Dom Casmurro' e fundou a Academia Brasileira de Letras?",
    "options": [
      {
        "id": "A",
        "text": "José de Alencar"
      },
      {
        "id": "B",
        "text": "Aluísio Azevedo"
      },
      {
        "id": "C",
        "text": "Machado de Assis"
      },
      {
        "id": "D",
        "text": "Lima Barreto"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L01",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Quem escreveu o clássico da literatura brasileira 'Dom Casmurro'?",
    "options": [
      {
        "id": "A",
        "text": "José de Alencar"
      },
      {
        "id": "B",
        "text": "Monteiro Lobato"
      },
      {
        "id": "C",
        "text": "Machado de Assis"
      },
      {
        "id": "D",
        "text": "Castro Alves"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L02",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Em 'O Pequeno Príncipe', qual flor especial ele cuida em seu planeta?",
    "options": [
      {
        "id": "A",
        "text": "Orquídea"
      },
      {
        "id": "B",
        "text": "Margarida"
      },
      {
        "id": "C",
        "text": "Rosa"
      },
      {
        "id": "D",
        "text": "Girassol"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L03",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual é o nome do menino que nunca envelhece e mora na Terra do Nunca?",
    "options": [
      {
        "id": "A",
        "text": "Pinóquio"
      },
      {
        "id": "B",
        "text": "Peter Pan"
      },
      {
        "id": "C",
        "text": "Tom Sawyer"
      },
      {
        "id": "D",
        "text": "Aladdin"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L04",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Quem é o autor das histórias do 'Sítio do Picapau Amarelo'?",
    "options": [
      {
        "id": "A",
        "text": "Monteiro Lobato"
      },
      {
        "id": "B",
        "text": "Ziraldo"
      },
      {
        "id": "C",
        "text": "Mauricio de Sousa"
      },
      {
        "id": "D",
        "text": "Manuel Bandeira"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L05",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual é o nome do bruxo protagonista da série de livros de J.K. Rowling?",
    "options": [
      {
        "id": "A",
        "text": "Percy Jackson"
      },
      {
        "id": "B",
        "text": "Eragon"
      },
      {
        "id": "C",
        "text": "Harry Potter"
      },
      {
        "id": "D",
        "text": "Gandalf"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L06",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Na peça 'Romeu e Julieta', de Shakespeare, a qual família pertence Romeu?",
    "options": [
      {
        "id": "A",
        "text": "Capuleto"
      },
      {
        "id": "B",
        "text": "Montecchio"
      },
      {
        "id": "C",
        "text": "Bourbon"
      },
      {
        "id": "D",
        "text": "Medici"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L07",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual detetive da literatura mora no endereço 221B Baker Street em Londres?",
    "options": [
      {
        "id": "A",
        "text": "Hercule Poirot"
      },
      {
        "id": "B",
        "text": "Sherlock Holmes"
      },
      {
        "id": "C",
        "text": "Arsène Lupin"
      },
      {
        "id": "D",
        "text": "James Bond"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L08",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual fidalgo espanhol luta contra moinhos de vento achando que são gigantes?",
    "options": [
      {
        "id": "A",
        "text": "D'Artagnan"
      },
      {
        "id": "B",
        "text": "Dom Quixote"
      },
      {
        "id": "C",
        "text": "Robinson Crusoé"
      },
      {
        "id": "D",
        "text": "Conde de Monte Cristo"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L09",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Quem é o famoso autor português do poema épico 'Os Lusíadas'?",
    "options": [
      {
        "id": "A",
        "text": "Fernando Pessoa"
      },
      {
        "id": "B",
        "text": "Luís de Camões"
      },
      {
        "id": "C",
        "text": "Eça de Queirós"
      },
      {
        "id": "D",
        "text": "José Saramago"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L10",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual é o nome da boneca de pano falante do Sítio do Picapau Amarelo?",
    "options": [
      {
        "id": "A",
        "text": "Narizinho"
      },
      {
        "id": "B",
        "text": "Emília"
      },
      {
        "id": "C",
        "text": "Tia Nastácia"
      },
      {
        "id": "D",
        "text": "Dona Benta"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L11",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Em 'As Crônicas de Nárnia', por onde as crianças entram pela primeira vez no mundo mágico?",
    "options": [
      {
        "id": "A",
        "text": "Por uma caverna"
      },
      {
        "id": "B",
        "text": "Por um guarda-roupa"
      },
      {
        "id": "C",
        "text": "Por um espelho"
      },
      {
        "id": "D",
        "text": "Por uma lareira"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L12",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Em 'Alice no País das Maravilhas', qual animal está sempre apressado com um relógio?",
    "options": [
      {
        "id": "A",
        "text": "Gato de Cheshire"
      },
      {
        "id": "B",
        "text": "Lagarta Azul"
      },
      {
        "id": "C",
        "text": "Coelho Branco"
      },
      {
        "id": "D",
        "text": "Chapeleiro Maluco"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L13",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual famosa fábula ensina a importância de trabalhar e se preparar para o inverno?",
    "options": [
      {
        "id": "A",
        "text": "A Lebre e a Tartaruga"
      },
      {
        "id": "B",
        "text": "A Cigarra e a Formiga"
      },
      {
        "id": "C",
        "text": "O Lobo e o Cordeiro"
      },
      {
        "id": "D",
        "text": "A Raposa e as Uvas"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L14",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual escritor brasileiro escreveu o famoso livro infantil 'O Menino Maluquinho'?",
    "options": [
      {
        "id": "A",
        "text": "Ziraldo"
      },
      {
        "id": "B",
        "text": "Mauricio de Sousa"
      },
      {
        "id": "C",
        "text": "Chico Buarque"
      },
      {
        "id": "D",
        "text": "Vinicius de Moraes"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L15",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual personagem clássica dos contos de fadas perde seu sapatinho de cristal no baile?",
    "options": [
      {
        "id": "A",
        "text": "Branca de Neve"
      },
      {
        "id": "B",
        "text": "Cinderela"
      },
      {
        "id": "C",
        "text": "Bela Adormecida"
      },
      {
        "id": "D",
        "text": "Rapunzel"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L16",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Qual dramaturgo inglês escreveu a famosa frase: 'Ser ou não ser, eis a questão'?",
    "options": [
      {
        "id": "A",
        "text": "Charles Dickens"
      },
      {
        "id": "B",
        "text": "Oscar Wilde"
      },
      {
        "id": "C",
        "text": "William Shakespeare"
      },
      {
        "id": "D",
        "text": "Arthur Conan Doyle"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L17",
    "category": "Literatura",
    "difficulty": "Fácil",
    "question": "Em 'Mogli, o Menino Lobo', que animal é o urso que ensina as leis da selva?",
    "options": [
      {
        "id": "A",
        "text": "Bagheera"
      },
      {
        "id": "B",
        "text": "Baloo"
      },
      {
        "id": "C",
        "text": "Shere Khan"
      },
      {
        "id": "D",
        "text": "Kaa"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L18",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Qual escritora brasileira escreveu o aclamado livro 'A Hora da Estrela'?",
    "options": [
      {
        "id": "A",
        "text": "Lygia Fagundes Telles"
      },
      {
        "id": "B",
        "text": "Cecília Meireles"
      },
      {
        "id": "C",
        "text": "Clarice Lispector"
      },
      {
        "id": "D",
        "text": "Rachel de Queiroz"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L19",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Quem escreveu o romance modernista 'Macunaíma, o herói sem nenhum caráter'?",
    "options": [
      {
        "id": "A",
        "text": "Oswald de Andrade"
      },
      {
        "id": "B",
        "text": "Mário de Andrade"
      },
      {
        "id": "C",
        "text": "Manuel Bandeira"
      },
      {
        "id": "D",
        "text": "Graciliano Ramos"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L20",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Qual escritor baiano é o autor de 'Capitães da Areia' e 'Tieta do Agreste'?",
    "options": [
      {
        "id": "A",
        "text": "Jorge Amado"
      },
      {
        "id": "B",
        "text": "Graciliano Ramos"
      },
      {
        "id": "C",
        "text": "Guimarães Rosa"
      },
      {
        "id": "D",
        "text": "Érico Veríssimo"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L21",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Em qual romance distópico de George Orwell aparece a figura do 'Grande Irmão'?",
    "options": [
      {
        "id": "A",
        "text": "Fahrenheit 451"
      },
      {
        "id": "B",
        "text": "Admirável Mundo Novo"
      },
      {
        "id": "C",
        "text": "1984"
      },
      {
        "id": "D",
        "text": "Laranja Mecânica"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L22",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Em 'O Senhor dos Anéis', qual criatura vive obcecada pelo anel chamando-o de 'Meu Precioso'?",
    "options": [
      {
        "id": "A",
        "text": "Sauron"
      },
      {
        "id": "B",
        "text": "Gollum"
      },
      {
        "id": "C",
        "text": "Saruman"
      },
      {
        "id": "D",
        "text": "Legolas"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L23",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Quem escreveu o romance sertanejo 'Grande Sertão: Veredas'?",
    "options": [
      {
        "id": "A",
        "text": "Euclides da Cunha"
      },
      {
        "id": "B",
        "text": "Guimarães Rosa"
      },
      {
        "id": "C",
        "text": "Monteiro Lobato"
      },
      {
        "id": "D",
        "text": "Graciliano Ramos"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L24",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "No livro 'Moby Dick', de Herman Melville, o que é a Moby Dick?",
    "options": [
      {
        "id": "A",
        "text": "Um navio pirata"
      },
      {
        "id": "B",
        "text": "Uma baleia branca gigante"
      },
      {
        "id": "C",
        "text": "Uma ilha misteriosa"
      },
      {
        "id": "D",
        "text": "Uma espada mágica"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L25",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Em qual livro de Franz Kafka o protagonista Gregor Samsa acorda transformado em inseto?",
    "options": [
      {
        "id": "A",
        "text": "O Processo"
      },
      {
        "id": "B",
        "text": "O Castelo"
      },
      {
        "id": "C",
        "text": "A Metamorfose"
      },
      {
        "id": "D",
        "text": "Carta ao Pai"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L26",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Quem é o 'defunto autor' que narra o livro 'Memórias Póstumas de Brás Cubas'?",
    "options": [
      {
        "id": "A",
        "text": "Quincas Borba"
      },
      {
        "id": "B",
        "text": "Brás Cubas"
      },
      {
        "id": "C",
        "text": "Bentinho"
      },
      {
        "id": "D",
        "text": "Rubião"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L27",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Qual famosa escritora inglesa escreveu o romance 'Orgulho e Preconceito'?",
    "options": [
      {
        "id": "A",
        "text": "Mary Shelley"
      },
      {
        "id": "B",
        "text": "Virginia Woolf"
      },
      {
        "id": "C",
        "text": "Jane Austen"
      },
      {
        "id": "D",
        "text": "Charlotte Brontë"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L28",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Quem é o autor do clássico naturalista brasileiro 'O Cortiço'?",
    "options": [
      {
        "id": "A",
        "text": "Aluísio Azevedo"
      },
      {
        "id": "B",
        "text": "Raul Pompeia"
      },
      {
        "id": "C",
        "text": "Lima Barreto"
      },
      {
        "id": "D",
        "text": "Olavo Bilac"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L29",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Qual poeta mineiro escreveu o célebre verso 'No meio do caminho tinha uma pedra'?",
    "options": [
      {
        "id": "A",
        "text": "Manuel Bandeira"
      },
      {
        "id": "B",
        "text": "Vinicius de Moraes"
      },
      {
        "id": "C",
        "text": "Carlos Drummond de Andrade"
      },
      {
        "id": "D",
        "text": "Mario Quintana"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L30",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Qual escritor francês é o autor dos clássicos 'Os Miseráveis' e 'O Corcunda de Notre-Dame'?",
    "options": [
      {
        "id": "A",
        "text": "Alexandre Dumas"
      },
      {
        "id": "B",
        "text": "Victor Hugo"
      },
      {
        "id": "C",
        "text": "Gustave Flaubert"
      },
      {
        "id": "D",
        "text": "Émile Zola"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L31",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Quem escreveu a clássica história gótica de 'Frankenstein' aos 18 anos de idade?",
    "options": [
      {
        "id": "A",
        "text": "Mary Shelley"
      },
      {
        "id": "B",
        "text": "Bram Stoker"
      },
      {
        "id": "C",
        "text": "Edgar Allan Poe"
      },
      {
        "id": "D",
        "text": "Agatha Christie"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L32",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Qual é o nome do fiel escudeiro que acompanha Dom Quixote em suas andanças?",
    "options": [
      {
        "id": "A",
        "text": "Sancho Pança"
      },
      {
        "id": "B",
        "text": "Rocinante"
      },
      {
        "id": "C",
        "text": "Dulcineia"
      },
      {
        "id": "D",
        "text": "Pedro Álvares"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L33",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "Qual grande escritor russo escreveu o clássico 'Crime e Castigo'?",
    "options": [
      {
        "id": "A",
        "text": "Liev Tolstói"
      },
      {
        "id": "B",
        "text": "Anton Tchekhov"
      },
      {
        "id": "C",
        "text": "Fiódor Dostoiévski"
      },
      {
        "id": "D",
        "text": "Maksim Gorki"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L34",
    "category": "Literatura",
    "difficulty": "Médio",
    "question": "No livro 'A Revolução dos Bichos', de George Orwell, quais animais comandam a revolta?",
    "options": [
      {
        "id": "A",
        "text": "Os cavalos"
      },
      {
        "id": "B",
        "text": "Os porcos"
      },
      {
        "id": "C",
        "text": "Os cachorros"
      },
      {
        "id": "D",
        "text": "As ovelhas"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L35",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual escritor português venceu o Prêmio Nobel de Literatura em 1998 com 'Ensaio sobre a Cegueira'?",
    "options": [
      {
        "id": "A",
        "text": "Eça de Queirós"
      },
      {
        "id": "B",
        "text": "Fernando Pessoa"
      },
      {
        "id": "C",
        "text": "José Saramago"
      },
      {
        "id": "D",
        "text": "António Lobo Antunes"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L36",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual obra de Gonçalves de Magalhães inaugurou o Romantismo no Brasil em 1836?",
    "options": [
      {
        "id": "A",
        "text": "I-Juca-Pirama"
      },
      {
        "id": "B",
        "text": "Suspiros Poéticos e Saudades"
      },
      {
        "id": "C",
        "text": "Canção do Exílio"
      },
      {
        "id": "D",
        "text": "Navio Negreiro"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L37",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Quem escreveu a colossal série de romances 'Em Busca do Tempo Perdido'?",
    "options": [
      {
        "id": "A",
        "text": "Marcel Proust"
      },
      {
        "id": "B",
        "text": "Jean-Paul Sartre"
      },
      {
        "id": "C",
        "text": "Albert Camus"
      },
      {
        "id": "D",
        "text": "Honoré de Balzac"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L38",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Quais são os dois personagens jagunços centrais em 'Grande Sertão: Veredas'?",
    "options": [
      {
        "id": "A",
        "text": "Fabiano e Sinhá Vitória"
      },
      {
        "id": "B",
        "text": "Riobaldo e Diadorim"
      },
      {
        "id": "C",
        "text": "Bentinho e Escobar"
      },
      {
        "id": "D",
        "text": "Leonardo e Vidinha"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L39",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual escritora inglesa do século XIX escreveu 'O Morro dos Ventos Uivantes'?",
    "options": [
      {
        "id": "A",
        "text": "Charlotte Brontë"
      },
      {
        "id": "B",
        "text": "Emily Brontë"
      },
      {
        "id": "C",
        "text": "Anne Brontë"
      },
      {
        "id": "D",
        "text": "Mary Shelley"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L40",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Em qual romance de Gabriel García Márquez a história se passa na cidade fictícia de Macondo?",
    "options": [
      {
        "id": "A",
        "text": "O Amor nos Tempos do Cólera"
      },
      {
        "id": "B",
        "text": "Crônica de uma Morte Anunciada"
      },
      {
        "id": "C",
        "text": "Cem Anos de Solidão"
      },
      {
        "id": "D",
        "text": "Do Amor e Outros Demônios"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L41",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual poeta romântico brasileiro escreveu 'O Navio Negreiro' e ficou conhecido como o 'Poeta dos Escravos'?",
    "options": [
      {
        "id": "A",
        "text": "Casimiro de Abreu"
      },
      {
        "id": "B",
        "text": "Gonçalves Dias"
      },
      {
        "id": "C",
        "text": "Castro Alves"
      },
      {
        "id": "D",
        "text": "Álvares de Azevedo"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L42",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Na 'Divina Comédia', de Dante Alighieri, qual poeta clássico atua como guia de Dante pelo Inferno?",
    "options": [
      {
        "id": "A",
        "text": "Homero"
      },
      {
        "id": "B",
        "text": "Virgílio"
      },
      {
        "id": "C",
        "text": "Horácio"
      },
      {
        "id": "D",
        "text": "Ovídio"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L43",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual evento histórico realizado em São Paulo em 1922 revolucionou a literatura e as artes no Brasil?",
    "options": [
      {
        "id": "A",
        "text": "Semana de Arte Moderna"
      },
      {
        "id": "B",
        "text": "Congresso de Escritores"
      },
      {
        "id": "C",
        "text": "Manifesto Antropofágico"
      },
      {
        "id": "D",
        "text": "Feira Internacional do Livro"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L44",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual monumental romance histórico de Liev Tolstói retrata as Guerras Napoleônicas na Rússia?",
    "options": [
      {
        "id": "A",
        "text": "Anna Karenina"
      },
      {
        "id": "B",
        "text": "Guerra e Paz"
      },
      {
        "id": "C",
        "text": "A Morte de Ivan Ilitch"
      },
      {
        "id": "D",
        "text": "Ressurreição"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L45",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual romance revolucionário do escritor irlandês James Joyce se passa em um único dia em Dublin?",
    "options": [
      {
        "id": "A",
        "text": "Retrato do Artista Quando Jovem"
      },
      {
        "id": "B",
        "text": "Dublinenses"
      },
      {
        "id": "C",
        "text": "Ulysses"
      },
      {
        "id": "D",
        "text": "Finnegans Wake"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L46",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual poeta grego da antiguidade compôs as famosas epopeias 'Ilíada' e 'Odisseia'?",
    "options": [
      {
        "id": "A",
        "text": "Sófocles"
      },
      {
        "id": "B",
        "text": "Homero"
      },
      {
        "id": "C",
        "text": "Eurípides"
      },
      {
        "id": "D",
        "text": "Hesíodo"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L47",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual obra de Graciliano Ramos narra a dura trajetória da família de retirantes com a cachorra Baleia?",
    "options": [
      {
        "id": "A",
        "text": "São Bernardo"
      },
      {
        "id": "B",
        "text": "Vidas Secas"
      },
      {
        "id": "C",
        "text": "Angústia"
      },
      {
        "id": "D",
        "text": "Infância"
      }
    ],
    "correctId": "B"
  },
  {
    "id": "LIT_L48",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Em 'Iracema', romance indianista de José de Alencar, qual famoso epíteto é dado à protagonista?",
    "options": [
      {
        "id": "A",
        "text": "A guerreira dos olhos de fogo"
      },
      {
        "id": "B",
        "text": "A donzela da floresta sagrada"
      },
      {
        "id": "C",
        "text": "A virgem dos lábios de mel"
      },
      {
        "id": "D",
        "text": "A princesa das águas claras"
      }
    ],
    "correctId": "C"
  },
  {
    "id": "LIT_L49",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual autor gaúcho escreveu a grandiosa trilogia épica 'O Tempo e o Vento'?",
    "options": [
      {
        "id": "A",
        "text": "Érico Veríssimo"
      },
      {
        "id": "B",
        "text": "Simões Lopes Neto"
      },
      {
        "id": "C",
        "text": "Moacyr Scliar"
      },
      {
        "id": "D",
        "text": "Luis Fernando Verissimo"
      }
    ],
    "correctId": "A"
  },
  {
    "id": "LIT_L50",
    "category": "Literatura",
    "difficulty": "Difícil",
    "question": "Qual poeta português criou heterônimos famosos como Álvaro de Campos, Ricardo Reis e Alberto Caeiro?",
    "options": [
      {
        "id": "A",
        "text": "Mário de Sá-Carneiro"
      },
      {
        "id": "B",
        "text": "Almeida Garrett"
      },
      {
        "id": "C",
        "text": "Fernando Pessoa"
      },
      {
        "id": "D",
        "text": "Antero de Quental"
      }
    ],
    "correctId": "C"
  }
];

export const questions = QUESTIONS;

