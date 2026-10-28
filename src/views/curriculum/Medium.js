import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Page from 'components/layout/Page';
import iconKnowledgeMatrix from 'images/illustrations/knowledgeMatrix.svg';
import iconLearningObjectives from 'images/illustrations/learningObjectives.svg';
import iconSustainableDevGoals from 'images/illustrations/sustainableDevGoals.svg';
import Collapse from '@mui/material/Collapse';
import styles from './Medium.module.scss';
import medium from './medium.jpg';
import schoolsImage from './schools-image.jpg';
import iconPlus from 'images/icons/plus1.svg';
import minus from 'images/icons/minus.svg';
import { contributors, schools } from './mediumContent';

// Botão que abre e fecha o conteúdo logo abaixo.
function Section({ id, title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button className={styles.collapseButton} onClick={() => setIsOpen(!isOpen)}>
        { isOpen ? <img src={minus} alt="Expandir escolas" /> : <img src={iconPlus} alt="Minimizar escolas" />}
        <span id={id} className={styles.buttonText}>
          {title}
        </span>
      </button>
      <Collapse in={isOpen}>
        {children}
      </Collapse>
    </>
  );
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

function Medium() {
    return (
      <Page>
        <header className={styles.header}>
          <div>
						<img className={styles.image} alt="" src={medium}></img>
					</div>
          <div className={styles.wrapperText + " row"}>
            <div className="col-md-8 offset-md-2">
              <p className={styles.doubleLineHeight}>
              	O Ensino Médio, última etapa da Educação Básica, está presente em 9 (nove)
								Unidades Educacionais da Rede Municipal de Ensino, que atendem 2.409
								estudantes (dados fornecidos em maio do presente ano pela Coordenadoria
								de Informações Educacionais – CIEDU). Dessas Unidades Educacionais,
								8 (oito) atendem estudantes em anos iniciais e finais do Ensino Fundamental e
								são denominadas de Escolas Municipais de Ensino Fundamental e Médio (EMEFM).
								Também temos a Escola Municipal de Educação Bilíngue para Surdos, a
								EMEBS Helen Keller que, desde 2019, também possui atendimento a esta etapa,
								comtemplando estudantes da Educação Infantil, do Ensino Fundamental e do
								Ensino Médio passando a ser a primeira escola pública a oferecer todas as etapas
								da Educação Básica Bilíngue.
              </p>
              <p className={styles.doubleLineHeight}>
								Temos um grande diferencial no que se refere à nossa Matriz Curricular,
								pois na Área de conhecimento das Linguagens e suas Tecnologias, oferecemos o
								componente curricular de Língua Espanhola, além da Língua Inglesa.
              </p>

							<Section id="schools" title="Conhecendo mais sobre as escolas">
								<br></br><br></br>
								<div>
									<img className={styles.image} alt="" src={schoolsImage}></img>
								</div>
								<br></br><br></br>
								<p className={styles.doubleLineHeight}>
									Nossas Unidades Educacionais que oferecem Ensino Médio estão em
									diferentes regiões da capital paulista. São elas: EMEFM Antônio
									Alves Veríssimo, localizada no bairro Jaraguá e EMEFM Guiomar
									Cabral, localizada no bairro Jardim Cidade Pirituba – ambas
									pertencentes à Diretoria Regional de Educação  Pirituba/Jaraguá
									– DRE P/J; EMEFM Professor Derville Allegretti e EMEFM Vereador
									Antônio Sampaio, ambas localizadas no bairro de Santana –
									Diretoria Regional de Educação  Jaçanã/Tremembé – DRE J/T;
									EMEFM Darcy Ri beiro, localizada no bairro de São Miguel
									Paulista - Diretoria Regional de Educação  São Miguel – DRE MP;
									EMEFM Oswaldo Aranha Bandeira de Mello, localizada na Cidade
									Tiradentes - Diretoria Regional de Educação  Guaianases –
									DRE G; EMEFM Professor Lin neu Prestes, localizada no bairro
									de Santo Amaro - Diretoria Regional de Educação  Santo Amaro
									– DRE SA; EMEFM Rubens Paiva, localizada no bairro Jardim Ângela -
									Diretoria Regional de Educação  São Mateus – DRE SM e EMEBS
									Helen Keller, localizada no bairro da Aclimação – Diretoria
									Regional de Educação  Ipiranga – DRE IP.
								</p>
							</Section>

							<Section id="history" title="Histórico das EMEFM e da EMEBS Helen Keller">
								<br></br><br></br>
								<div>
									<p className={styles.doubleLineHeight}>
										As 8 (oito) Es colas Municipais de Ensino Fundamental e Médio
										(EMEFM), assim como a EMEBS Helen Keller, ultrapassam os
										territórios nos quais estão inseridas, recebendo estudantes
										dos diferentes bairros da capital paulista e de diversos
										municípios na Grande São P aulo, como Guarulhos, Itaquaquecetuba,
										Santo André etc. Cada uma delas possui características ímpares,
										projetos próprios e grande reconhecimento da comunidade atendida,
										sendo procuradas pela qualidade de suas propostas pedagógicas.
									</p>
								</div>
								<br></br>
								{schools.map(school => (
									<React.Fragment key={school.name}>
										<div>
											<p className={styles.doubleLineHeight}>
												<i className={styles.credit}>{school.name}</i>
											</p>
											<p className={styles.doubleLineHeight}>{school.history}</p>
											<a target="_blank" rel="noopener noreferrer" href={school.link}>
												{school.linkLabel}
											</a>
										</div>
										<br></br>
										<br></br>
									</React.Fragment>
								))}

							</Section>
							<Section id="curriculum" title="O Currículo do Ensino Médio da Rede Municipal de Ensino de São Paulo">
								<br></br><br></br>
								<p className={styles.doubleLineHeight}>
									A elaboração curricular do documento do Ensino Médio da Cidade
									 de São Paulo é a última etapa de um processo que se iniciou,
									 em 2017, com a elaboração do Currículo da Cidade: Ensino
									 Fundamental. Em 2018, houve a elaboração dos Currículos da
									 Cidade: Educação Infantil,  Educação de Jovens e Adultos,
									 Língua Brasileira de Sinais e Língua Portuguesa para Surdos -
									 Libras. Para saber mais sobre estes documentos acesse:
								</p>
								<br></br>
								<div>
									<a target="_blank" rel="noopener noreferrer" href="https://educacao.sme.prefeitura.sp.gov.br/curriculo-da-cidade/ ">
										Curriculo da Cidade
									</a>
								</div>
								<br></br>
								<p className={styles.doubleLineHeight}>
									O Currículo da Cidade do Ensino Médio, assim como os outros
									documentos curriculares da SME, tem como Princípios
									Norteadores: a Educação Inclusiva, a Equidade e a Educação
									Integral. Além disso, os materiais trazem também uma Matriz
									de Saberes que contempla princípios Éticos, Políticos e
									Estéticos, orientados para o exercício da cidadania responsável,
									tendo em vista possibilitar a construção de uma sociedade mais
									igualitária, justa, democrática e solidária,  e também os
									Objetivos de Desenvolvimento Sustentável – ODS pactuados na
									Agenda 2030, em que buscamos relacionar os Objetivos de
									Aprendizagem e Desenvolvimento a cada um dos 17 ODS, por meio
									de temas prementes, como: direitos humanos, meio ambiente,
									desigualdades sociais e regionais, intolerâncias culturais e
									religiosas, abusos de poder, populações excluídas, avanços
									tecnológicos e seus impactos, política, economia, educação
									financeira, consumo e sustentabilidade, entre outros, a fim de
									formar cidadãos globais, entendendo que todos (governos,
									agências da ONU, sociedade civil organizada, setor privado e
									cada cidadão do país) têm responsabilidade para que o mundo
									consiga atingir os ODS, adotados em 2015 pela Assembleia Geral
									da ONU e inseridos de maneira inovadora, desde 2017, em nossos
									currículos.
								</p>
								<p className={styles.doubleLineHeight}>
									O município de São Paulo, mesmo antes da homologação da última
									versão da Base Nacional Comum Curricular (BNCC), mobilizou
									esforços para rever seus materiais curriculares. Em 14 de
									dezembro de 2018, foi homologada pelo Ministério da Educação,
									a Base Nacional Comum Curricular do Ensino Médio. Pela primeira
									vez, o país passou a ter um documento normativo que define o
									conjunto de conhecimentos essenciais que todos os estudantes
									devem desenvolver, progressivamente, ao longo da Educação Básica.
								</p>
								<p className={styles.doubleLineHeight}>
									Atendendo à demanda da própria rede e à determinação legal de
									que os municípios deveriam rever seus currículos, em 2017, a
									Secretaria Municipal de Educação retomou as discussões que
									vinham acontecendo nos grupos de formação, entre 2015 e 2016,
									com vários atores do Ensino Médio: professores, coordenadores
									pedagógicos, diretores e demais profissionais da Rede Municipal
									de Ensino - RME.
								</p>
								<p className={styles.doubleLineHeight}>
									No final do ano de 2019, ocorreu o 1º Encontro do Novo Ensino
									Médio, que contou com a participação de Professores,
									Coordenadores Pedagógicos e Diretores das EMEFMs, Supervisores
									de Ensino, técnicos da SME, Coordenadora da Coordenadoria
									Pedagógica - COPED e Membros do Conselho Municipal de Educação
									de São Paulo. Esta reunião teve como objetivo iniciar o diálogo
									acerca do processo de construção do Currículo do Ensino Médio.
								</p>
								<p className={styles.doubleLineHeight}>
									Em 2020, efetivamente, colocou-se em prática a elaboração do
									Currículo da Cidade: Ensino Médio, tendo como base os documentos
									federais, publicados a fim de nortear o Novo Ensino Médio.
									Foram organizados Grupos de Trabalho compostos por especialistas
									e professores de todas as UEs que possuem Ensino Médio,
									contemplando todos os componentes curriculares. A produção
									dos documentos curriculares buscou elucidar os pilares
									norteadores da SME: a Educação Inclusiva, a Equidade e a
									Educação Integral, os quais relacionam-se diretamente com o
									previsto na BNCC ao assegurar para nossos estudantes o
									desenvolvimento das dez competências gerais (conhecimento;
									pensamento científico, crítico e criativo; repertório cultural;
									comunicação; cultura digital; trabalho e projeto de vida;
									argumentação; autoconhecimento e autocuidado; empatia e
									cooperação; responsabilidade e cidadania), que consubstanciam,
									no âmbito pedagógico, os Direitos de Aprendizagem e
									Desenvolvimento. Também foram considerados os dados levantados
									sobre demandas e necessidades das escolas, profissionais e
									estudantes; a Base Nacional Comum Curricular, Diretrizes
									Curriculares e outros documentos federais; Especialistas dos
									componentes e áreas curriculares para assessorar os Grupos de
									Trabalho e professores de todos os componentes curriculares do
									Ensino Médio; e a escuta feita junto aos estudantes, por meio
									de rodas de conversa. Desta forma, coletivamente, estudantes,
									professores e demais profissionais da RME construíram,
									paulatinamente, um novo documento orientador da rede para o
									Ensino Médio.
								</p>
								<p className={styles.doubleLineHeight}>
									A partir do ano de 2020, a SME, em articulação com as Unidades
									Educacionais que possuem EM, passa a atender a nova matriz
									curricular do Novo Ensino Médio, em cumprimento às diretrizes
									da Base Nacional Curricular Comum Ensino Médio (BNCC- EM) que
									estabelece que o Currículo do Ensino Médio será composto pelas
									aprendizagens essenciais definidas pela Base Nacional Comum
									Curricular e por Percursos de Estudo e Formação - nomenclatura
									dada pela RME aos Itinerários Formativos previstos na BNCC,
									DCNEM e demais documentos norteadores, conforme a relevância
									para o contexto local e a possibilidade dos sistemas de ensino
									que deverão ser organizados por meio da oferta de diferentes
									arranjos curriculares.
								</p>
								<p className={styles.doubleLineHeight}>
									A Lei Federal determinou um prazo para início da implantação
									do Novo Médio no ano de 2020 e a SME decidiu realizar a
									implantação desta robusta mudança, de forma parcial, apenas
									nas escolas diurnas, transformando-as em período integral,
									com 9 aulas de 45 minutos e colocando o Itinerário Integrador
									como primeiro contato dos estudantes com a ideia de
									aprendizagem por área do conhecimento.
								</p>
								<p className={styles.doubleLineHeight}>
									O documento estabelece especificamente para o ano de 2020 uma
									matriz curricular composta por 900 horas de parte comum, ou
									seja, de BNCC, além de 450 horas de Itinerários Integradores.
									Assim, as Escolas Municipais de Ensino Fundamental e Médio
									(EMEFMs), que oferecem esta etapa da Educação Básica no
									período diurno, passam, a partir desse ano, a ofertar o Ensino
									Médio em tempo integral com 45 aulas semanais, ou seja, 9
									(nove) aulas diárias, de 45 minutos cada.
								</p>
								<p className={styles.doubleLineHeight}>
									A Reforma do Ensino Médio propõe que o currículo tenha um
									equilíbrio tanto da parte comum quanto dos itinerários
									formativos. O caminho escolhido pela Secretaria Municipal de
									Educação, especificamente, no ano de 2020, por meio do
									“Novo Ensino Médio - Educação Integral” foi de oferecer além
									dos componentes curriculares da BNCC, os Itinerários
									Integradores: Cultura dos Países de Língua Espanhola;
									Práticas Esportivas; Expressões Culturais e Artísticas;
									Tecnologias para a Aprendizagem; Produção Textual; Sala de
									Leitura e Investigação Científica e Processos Matemáticos,
									atendendo assim, ao proposto pela BNCC. Para o ano de 2021,
									já com os documentos curriculares finalizados, a SME pretende
									que os estudantes do Ensino Médio tenham como escolher seu
									trajeto formativo a partir dos diversos Percursos de Estudo e
									Formação das diferentes áreas.
								</p>
							</Section>
							<Section id="law" title="Legislação sobre o Novo Ensino Médio">
								<br></br><br></br>
								<p className={styles.doubleLineHeight}>
									A Lei nº13.415, de 16 de fevereiro de 2017 que, dentre outras
									ações, altera a Lei de Diretrizes e Bases da Educação Nacional
									(nº 9.394 de 20 de dezembro de 1996), estabelece mudanças para
									a estruturação do Ensino Médio, atribuindo aos Estados e ao
									Distrito Federal a responsabilidade pela implementação das novas
									Diretrizes Nacionais – Novo Ensino Médio.
								</p>
								<p className={styles.doubleLineHeight}>
									A base para esta implementação deve estar pautada em uma série de documentos, como:
								</p>
								<ul className={styles.lawListFirst}>
									<li>
										<p className={styles.doubleLineHeight}>Resolução CNE/CEB nº 3 de 21 de novembro de 2018 –
											atualização das Diretrizes Curriculares Nacionais para o
											Ensino Médio;
										</p>
									</li>
									<li>
										<p className={styles.doubleLineHeight}>
											Resolução CNE/CP nº 4 de 17 de dezembro de 2018 – aprova
											a Base Nacional Comum Curricular (BNCC);
										</p>
									</li>
									<li>
										<p className={styles.doubleLineHeight}>
											Portaria nº 1432 de 28 de dezembro 2018 que traz os
											referenciais para os itinerários formativos para o Ensino Médio.
										</p>
									</li>
								</ul>
								<p className={styles.doubleLineHeight}>
									O currículo do Ensino Médio, de acordo com a referida Lei Federal, será composto por:
								</p>
								<ul className={styles.lawListSecond}>
									<li>
										<p className={styles.doubleLineHeight}>
											BNCC – formação geral básica, que tem por objetivo, com
											equidade e qualidade, garantir a todos os estudantes as
											aprendizagens essenciais, com um total não superior a 1800
											h; define dez competências gerais e um conjunto de objetivos
											de aprendizagem, sendo que as aprendizagens essenciais
											introduzidas no Ensino Fundamental deverão ser consolidadas
											e aprofundadas. Os componentes de Língua Portuguesa e
											Matemática deverão estar presentes em todos os anos.
										</p>
									</li>
									<li>
										<p className={styles.doubleLineHeight}>
											Itinerários Formativos: conjunto de unidades curriculares
											que possibilitam ao estudante aprofundar seus conhecimentos
											e se preparar para o prosseguimento de estudos e para o
											mundo do trabalho, organizados por área de conhecimento:
										</p>
										<ul className={styles.lawListThird}>
											<li><p className={styles.doubleLineHeight}>Linguagens e suas Tecnologias;</p></li>
											<li><p className={styles.doubleLineHeight}>Matemática e suas Tecnologias;</p></li>
											<li><p className={styles.doubleLineHeight}>Ciências da Natureza e suas Tecnologias;</p></li>
											<li><p className={styles.doubleLineHeight}>Ciências Humanas e Sociais Aplicadas.</p></li>
										</ul>
									</li>
								</ul>
								<p className={styles.doubleLineHeight}>
									O Currículo do Ensino Médio prevê a formação integral do
									estudante, de forma a contribuir com a construção de seu
									projeto de vida e com o seu desenvolvimento em todas as
									dimensões (física, intelectual, social, emocional e cultural).
								</p>
							</Section>
							<Section id="education" title="Percursos de Estudo e Formação">
								<br></br><br></br>
								<p className={styles.doubleLineHeight}>
									É sabido que os Itinerários Formativos propostos pela BNCC
									para o Ensino Médio seguem cinco grandes áreas de
									conhecimento: Linguagens e suas Tecnologias; Matemática e
									suas Tecnologias; Ciências da Natureza e suas Tecnologias;
									Ciências Humanas e Sociais Aplicadas e Formação Técnica e
									Profissional, que compõem as possibilidades de escolha das
									disciplinas a serem cursadas pelos estudantes. Na Rede
									Municipal de Ensino de São Paulo, dado o seu histórico e
									especificidades, a opção por criarmos Percursos de Estudo e
									Formação no lugar de Itinerários Formativos, como os
									indicados pela BNCC, ocorreu  não só devido a uma diferenciação
									semântica, na qual a ideia de um Percurso de Estudo e Formação
									estava em maior consonância com as concepções, premissas e
									princípios já explicitados no Currículo da Cidade, mas também
									por optarmos por uma proposição que permitisse às escolas
									estabelecer uma inter-relação com temáticas diversas como:
									ética, cidadania, democracia, relações étnico-raciais, direitos
									humanos, diversidade, juventudes, tecnologias e cultura digital,
									relações interpessoais, meio ambiente e sustentabilidade,
									inclusão de pessoas com deficiência e transtornos globais do
									desenvolvimento, gênero e sexualidade, mundo do trabalho,
									saúde e bem-estar, saúde pública, projeto de vida,
									desenvolvimento tecnológico-científico, entre outras temáticas
									emergentes.
								</p>
								<p className={styles.doubleLineHeight}>
									Além dos 4 eixos que já constavam dos Itinerários Formativos
									da BNCC (Empreendedorismo, Processos Criativos, Investigação
									Científica e Mediação e Intervenção Sociocultural), outros 3
									eixos foram acrescidos nos Percursos de Estudo e Formação:
									Mediação e intervenção política econômica; Multiculturalismo
									e Multiletramentos, Gestão de conteúdos e informações.
								</p>
								<p className={styles.doubleLineHeight}>
									Sendo assim, os adolescentes e jovens poderão ter acesso a
									uma noção mais ampliada acerca do conhecimento de mundo, em
									nível médio, de modo que poderão aprofundar o contato,
									refletir e debater sobre  diversos aspectos da vida em
									sociedade, assim como também com temas que lhes permitam
									construir e compreender seus processos identitários de forma
									crítica, interdisciplinar, contextualizada, com vistas à sua
									educação integral, numa perspectiva emancipatória que respeite
									seus centros de interesse.
								</p>
								<div className={styles.wrapperBox}>
									<p className={styles.doubleLineHeight}>
										Em 2020, durante o período de isolamento social, devido ao
										fechamento das escolas e à necessidade de fornecer aos
										estudantes material que pudesse minimizar os prejuízos
										pedagógicos causados pela suspensão de aulas, a Secretaria
										Municipal de Educação produziu o material didático “Trilhas
										de aprendizagem para o Ensino Médio”. Trata-se de um caderno,
										dividido em dois volumes, com atividades de todos os componentes
										curriculares, organizadas de forma integrada, ultrapassando
										a fronteira das séries e, por vezes, do próprio componente
										curricular.
									</p>
									<a target="_blank" rel="noopener noreferrer" href={'https://educacao.sme.prefeitura.sp.gov.br/trilhas-de-aprendizagens/'}>
										Trilhas de aprendizagem
									</a>
								</div>
								<br></br><br></br>
								{contributors.map(group => (
									<React.Fragment key={group.title}>
										<p className={styles.doubleLineHeight + " listTitle"}><b>{group.title}</b></p>
										<div className={styles.contribuitorsList}>
											<ul className={styles.educationList}>
												{group.people.map(person => (
													<li key={person.name}>
														<p className={styles.doubleLineHeight}><b>{person.name}</b> – {person.role}</p>
													</li>
												))}
											</ul>
										</div>
									</React.Fragment>
								))}
							</Section>
            </div>
          </div>
        </header>
				<br></br>
				<br></br>
        <hr />
        <div className={styles.slogan}>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <p>
                O direito à educação implica a garantia das condições e
                oportunidades necessárias para que os estudantes tenham acesso a
                uma formação indispensável para a sua realização pessoal,
                formação para a vida produtiva e pleno exercício da cidadania.
              </p>
            </div>
          </div>
        </div>
        <hr />
        <ul className={styles.list}>
          <li className={styles.sustainableDevGoals}>
            <a target="_blank" href="/ods">
              <img
                src={iconSustainableDevGoals}
                alt="Objetivos de Desenvolvimento Sustentável (ODS)"
              />
              <h2>Objetivos de Desenvolvimento Sustentável (ODS)</h2>
            </a>
            <p className={styles.doubleLineHeight}>
              O Currículo da Cidade foi um dos primeiros do mundo a se alinhar
              aos ODS da Organização das Nações Unidas. Os 17 objetivos e 169
              metas buscam concretizar os direitos humanos de todos e alcançar a
              igualdade de gênero. Aqui você pode conhecê-los em detalhe, além
              de encontrar as sequências didáticas relacionadas.
            </p>
            {/* <a className={styles.btn} to="/ods">
              Explore e encontre sequências
            </a> */}
          </li>
          <li className={styles.knowledgeMatrix}>
            <a target="_blank" href="/matriz-de-saberes">
              <img src={iconKnowledgeMatrix} alt="Matriz de Saberes" />
              <h2>Matriz de Saberes</h2>
            </a>
            <p className={styles.doubleLineHeight}>
              A Matriz de Saberes tem como propósito formar cidadãos éticos,
              responsáveis e solidários que fortaleçam uma sociedade mais
              inclusiva, democrática, próspera e sustentável. Aqui você pode
              conhecer as dimensões da matriz e encontrar as sequências
              relacionadas.
            </p>
            {/* <a className={styles.btn} to="/matriz-de-saberes">
              Explore e encontre sequências
            </a> */}
          </li>
          <li className={styles.learningObjectives}>
            <a target="_blank" href="/objetivos-de-aprendizagem">
              <img
                src={iconLearningObjectives}
                alt="Objetivos de Aprendizagem"
              />
              <h2>Objetivos de Aprendizagem</h2>
            </a>
            <p className={styles.doubleLineHeight}>
              No Currículo da Cidade, os objetivos de aprendizagem e
              desenvolvimento orientam-se pela Educação Integral a partir da
              matriz de saberes e indicam o que os estudantes devem alcançar a
              cada ano como resultado das experiências de ensino e de
              aprendizagem intencionalmente previstas para esse fim.
            </p>
            {/* <a className={styles.btn} to="/objetivos-de-aprendizagem">
              Explore e encontre sequências
            </a> */}
          </li>
        </ul>
      </Page>
    );
}

export default Medium;
