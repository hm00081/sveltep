//TODO topic map source code, 살펴보기만 하기.
// import Vue from 'vue';
// import { Component } from 'vue-property-decorator';

// import _ from 'lodash';
// import axios from 'axios';
// import vis from 'vis';

// // defualt local data
// // fine dust data
// import d_contents from '@/data/contents/defaultMorphData.json';
// import d_networkData from './infovis-json-data/default/defaultNetworkData.json';
// import d_fullScript from './infovis-json-data/default/defaultFullScript.json';
// import d_users from './infovis-json-data/default/defaultUsers.json';
// // brainstorming data
// import brainstorming_contents from '@/views/narrative-suhyun/brainstormingMorphData.json';
// import brainstorming_networkData from './infovis-json-data/testNetworkData/testNetworkData3.json';
// import brainstorming_fullScript from './infovis-json-data/프로젝트기획회의록/project-script.json';
// import brainstorming_users from './infovis-json-data/프로젝트기획회의록/project-users.json';

// // idlab meeting data
// import idlabmeeting_fullscript from '@/views/topicmap-suhyun/infovis-json-data/idlabMeeting/idlabmeeting-script.json';
// import idlabmeeting_contents from '@/views/narrative-suhyun/idlabmeetingMorphData.json';
// // tslint:disable-next-line: max-line-length
// import idlabmeeting_networkData from '@/views/topicmap-suhyun/infovis-json-data/idlabMeeting/idlabmeeting-networkdata.json';
// import idlabmeeting_users from '@/views/topicmap-suhyun/infovis-json-data/idlabMeeting/idlabmeeting-users.json';

export interface DisplayKeywordItem {
	label: string;
	barRatio: number;
	count: number;
}

export interface DisplayScriptItem {
	profileImage: string;
	talker: string;
	time: string;
	text: string;
}

export interface ActionItem {
	actionItemId: string; // '1234'
	text: string; // "API스펙 문서 수정",
	who: string; // "이호진",
	when: string; // "2019-03-08"
	time: number; // 시간
	tooltipShown: boolean;
	selected: boolean;
}

interface Node {
	id: string;
	label: string;
	size: any; // degree
	count: number;
	color?: any;
	agenda?: number;
	x?: number;
	fixed?: {
		x?: boolean;
		y?: boolean;
	};
}

interface Edge {
	from: string;
	to: string;
	width: number; // 구문분석 weight
	count: number;
	color?: any;
}

interface Topic {
	label: string;
	count: number;
	keywords: Keyword[];
	// selected?: boolean;
}

interface Keyword {
	label: string;
	count: number;
}

interface Script {
	talkerName: string;
	talkerId: string;
	text: string;
	startTime: number;
	endTime: number;
	agenda: number;
}

interface Agenda {
	startIndex: number;
	endIndex: number;
	startTime: number;
	endTime: number;
	// topicNodes: Node[];
	topics: Topic[];
	name: string;
}

export interface Speech {
	text: string;
	index: number;
	name: string;
	// morphs: MorphWord[];
}

export interface Point {
	x: number;
	y: number;
	diff: number;
	std: number;
}
export interface SpeechPoint {
	startPoint: Point;
	endPoint: Point;
	point: Point;
	speechs: Speech[];
	size: number;
}

export interface User {
	name: string;
	speechPoints: SpeechPoint[];
	speechs: Speech[];
	path: any;
	validSpeechRanking: number;
	numOfValidSpeech: number;
	validSpeechTime: number;
	tooltipValidSpeechTime: boolean;
	speechTime: number;
	[key: string]: any;
}

@Component
export default class MindMap extends Vue {
	public seperateCount: number = 50;
	// @ts-ignore
	private displayKeywordItems: DisplayKeywordItem[] = [];
	private displayScriptItems: DisplayScriptItem[] = [];

	private network: vis.Network | null = null;
	private fullScript!: Script[];
	private contents: Speech[] = [];
	private config: any = {};
	private isConfigOpened = false;

	private selectedKeyword: string = '키워드';
	private selectedScript: string = '스크립트';
	private numOfNodes = 100;

	private usingMorphTag = ['NNG', 'NNP'];

	private speech!: string;

	private uiInputModal: boolean = false;
	private uiLoading: boolean = false;
	private nodeLabelDialogOpened: boolean = false;
	private modelText: string = '';

	private jsonString: string = '';
	private totalTime: number = 0;

	private ui = {
		imageDialog: false,
		selectedImageUrl: ''
	};

	private engName = {
		김지영: 'J. Kim',
		강병원: 'B. Kang',
		김현아: 'H. Kim',
		이덕환: 'D. Lee',
		장임석: 'I. Jang',
		김희웅: 'W. Kim',
		P1: 'J. Kim',
		P2: 'B. Kang',
		P3: 'H. Kim',
		P4: 'D. Lee',
		P5: 'I. Jang',
		P6: 'W. Kim'
	};
	//tODO 100분토론으로 하네.
	private iconImgUser = {
		김지영: 'http://thumb.mtstarnews.com/06/2018/07/2018072407172400401_1.jpg',
		강병원: 'http://www.mtime.co.kr/news/photo/201812/12818_8854_2259.jpg',
		김현아: 'http://dimg.donga.com/ugc/VOTE/2016/56/86/17/a5/568617a520ad6af5c11e1451628493338.JPG',
		이덕환: 'http://www.ikunkang.com/news/photo/201812/26236_11267_5615.jpg',
		장임석:
			'http://static.news.zumst.com/images/68/2016/05/12/4aed8531e860464c99581175e66f992e.jpg',
		김희웅: 'http://cfs16.tistory.com/image/29/tistory/2010/11/23/09/11/4ceb06b5c7a65',
		P1: 'http://thumb.mtstarnews.com/06/2018/07/2018072407172400401_1.jpg',
		P2: 'http://www.mtime.co.kr/news/photo/201812/12818_8854_2259.jpg',
		P3: 'http://dimg.donga.com/ugc/VOTE/2016/56/86/17/a5/568617a520ad6af5c11e1451628493338.JPG',
		P4: 'http://www.ikunkang.com/news/photo/201812/26236_11267_5615.jpg',
		P5: 'http://static.news.zumst.com/images/68/2016/05/12/4aed8531e860464c99581175e66f992e.jpg',
		P6: 'http://cfs16.tistory.com/image/29/tistory/2010/11/23/09/11/4ceb06b5c7a65',
		한현우: 'https://spnimage.edaily.co.kr/images/photo/files/NP/S/2019/03/PS19032000019.jpg',
		허재종: 'https://kin-phinf.pstatic.net/20180303_7/1520075009970l7GvU_JPEG/1520075009831.jpg',
		조원민:
			// tslint:disable-next-line: max-line-length
			'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile6.uf.tistory.com%2Fimage%2F999CCB335A0FC0833A5486',
		홍준엽:
			// tslint:disable-next-line: max-line-length
			'http://mblogthumb4.phinf.naver.net/MjAxODAyMTFfMjUg/MDAxNTE4Mjc1ODkwMTA3.5wXQMekjpqXfoa7lhfLuRS6kG92GKhKuENQdnoRqRhsg.YVjsEpT3yY7CK-ou0grRRHS17JYpzG4_12mzDeHZ9kwg.JPEG.goyujin0528/IMG_1182.jpg?type=w800',
		박찬희: 'https://spnimage.edaily.co.kr/images/photo/files/NP/S/2019/03/PS19032000019.jpg',
		윤태린: 'http://t1.daumcdn.net/news/201702/24/segye/20170224184119304kbhs.jpg',
		이수정: 'http://t1.daumcdn.net/news/201702/24/segye/20170224184119304kbhs.jpg',
		홍주원: 'http://img.mbn.co.kr/filewww/news/other/2018/09/07/120173429682.jpg'
	};

	private color = {
		node_agenda: [
			'#53A4E3',
			'#9B9B9B',
			'#F8BE14',
			'#FF6363',
			'#57915E',
			'#FF9292',
			'#90DAE4',
			'#9972E4',
			'#FFA834',
			'#677686'
		],
		node_border_agenda: [
			'#53A4E3',
			'#9B9B9B',
			'#F8BE14',
			'#FF6363',
			'#57915E',
			'#FF9292',
			'#90DAE4',
			'#9972E4',
			'#FFA834',
			'#677686'
		],
		node_highlight_agenda: [
			'#53A4E3',
			'#9B9B9B',
			'#F8BE14',
			'#FF6363',
			'#57915E',
			'#FF9292',
			'#90DAE4',
			'#9972E4',
			'#FFA834',
			'#677686'
		],
		node_highlight_border_agenda: [
			'#00457B',
			'#404040',
			'#997408',
			'#7F0101',
			'#033809',
			'#CC4B4B',
			'#3696A3',
			'#3E0AA3',
			'#61431C',
			'#151515'
		]
	};

	private networkData: {
		nodes: Node[];
		edges: Edge[];
	} = {
		nodes: [],
		edges: []
	};

	private agendas: Agenda[] = [];

	// vis.DataSet()으로 랩핑한 nodes와 edges들
	private visNetworkData: {
		nodes: vis.DataSet<Node>;
		edges: vis.DataSet<Edge>;
	} = { nodes: new vis.DataSet(), edges: new vis.DataSet() };
	// edges를 hash 자료구조로 만든 것
	private edgeHash: {
		[index: string]: Edge;
	} = {};
	// nodes를 hash 자료구조로 만든 것
	private nodeHash: {
		[id: string]: Node;
	} = {};
	private selectedNodeIds: vis.IdType[] = [];
	private semiSelectedNodeIds: vis.IdType[] = [];

	// cut 되지 않은 전체 nodes & edges
	private totalNodes: Node[] = [];
	private totalEdges: Edge[] = [];
	private topics: Topic[] = [];

	private topicHighLightStyle = {
		'background-color': 'white',
		// tslint:disable-next-line: object-literal-key-quotes
		color: 'black'
	};

	private maxNodeSize = 30;
	private minNodeSize = 10;

	private maxEdgeWidth = 10;
	private minEdgeWidth = 5;

	private speakingBias: number = 1; // default 5

	// 사이드 뷰에 어떤거 보여줄 지 (script, image, actionItem)
	private sideviewMode: string = 'script';

	private users: User[] = d_users;
	private isMounted = false;

	private actionItems: ActionItem[] = [
		// {
		//   actionItemId: '1234',
		//   text: '서비스 디자인 디벨롭',
		//   who: '홍주원',
		//   when: '2019-03-23',
		//   time: 1239400, // 1239400
		//   tooltipShown: false,
		//   selected: false
		// },
		// {
		//   actionItemId: '1234',
		//   text: '서비스 프론트 개발 인수인계',
		//   who: '홍준엽, 조원민',
		//   when: '2019-03-23',
		//   time: 2039400, // 1239400
		//   tooltipShown: false,
		//   selected: false
		// },
		// {
		//   actionItemId: '1233',
		//   text: '서비스 설문조사 링크 해결방안 고안',
		//   who: '이수정, 홍준엽, 허재종',
		//   when: '2019-03-18',
		//   time: 4511200,
		//   tooltipShown: false,
		//   selected: false
		// }
		{
			actionItemId: '1000',
			text: '타깃 사용자, 시장 포지션 조사',
			who: '홍준엽, 조원민, 윤태린',
			when: '2019-03-23',
			time: 4050000, // 1239400
			tooltipShown: false,
			selected: false
		},
		{
			actionItemId: '1001',
			text: '서비스 프론트 개발 인수인계',
			who: '박찬희, 허재종',
			when: '2019-03-23',
			time: 4500000, // 1239400
			tooltipShown: false,
			selected: false
		}
	];

	private images = [
		// {
		//   imageId: '787654321012345',
		//   url:
		//     'http://www.kaids.or.kr/files/2014/08/25/a54b47fa02d198cc9294267f486eaa61155042.jpg'
		// },
		// {
		//   imageId: '787654321012344',
		//   url: 'https://t1.daumcdn.net/cfile/tistory/255EE44956CBEE3424'
		// }
		{
			imageId: '787654321012345',
			url:
				// tslint:disable-next-line: max-line-length
				'https://zdnet4.cbsistatic.com/hub/i/r/2016/10/25/ce2b7265-f673-42e4-823d-2a69a3e72692/resize/770xauto/d4230a86fb907f3aa9528da745e8b45e/googlejamboard.jpg'
		},
		{
			imageId: '787654321012344',
			url: 'https://hips.hearstapps.com/sev.h-cdn.co/assets/15/20/980x490/landscape-1431384870-notes.jpg?resize=1200:*'
		}
	];

	private meetingTitle: string = 'Causes and Countermeasures of High Concentration Fine Dust';
	private meetingDateTime: string = '2019-03-13  00:05:17';
	private participants: string[] = ['J. Kim', 'B. Kang', 'H. Kim', 'D. Lee', 'I. Jang', 'W. Kim'];

	// 변경할 노드 label input
	private nodeLabelText: string = '';

	private debounceRemakeMindmap = _.debounce(this.remakeMindmap, 500);

	public async mounted() {
		this.$nextTick(() => {
			this.isMounted = true;
		});
		// get & set fullScript : 스크립트 뷰에 사용
		if (this.$route.query.data === 'app-brainstorming') {
			this.fullScript = brainstorming_fullScript;
			this.networkData = brainstorming_networkData;
			this.totalNodes = brainstorming_networkData.nodes;
			this.totalEdges = brainstorming_networkData.edges;
			this.topics = brainstorming_networkData.topics;

			this.contents = brainstorming_contents;

			this.users = brainstorming_users;
		} else if (this.$route.query.data === 'idlabmeeting') {
			this.fullScript = idlabmeeting_fullscript;
			this.networkData = idlabmeeting_networkData;
			this.totalNodes = idlabmeeting_networkData.nodes;
			this.totalEdges = idlabmeeting_networkData.edges;
			this.topics = idlabmeeting_networkData.topics;

			this.contents = idlabmeeting_contents;

			this.users = idlabmeeting_users;
		} else {
			// fine-dust-discussion
			// this.contents, this.fullScript, this.networkData, this.users can be changed
			this.contents = d_contents;
			// @ts-ignore
			this.fullScript = d_fullScript;
			this.networkData = d_networkData;
			this.totalNodes = d_networkData.nodes;
			this.totalEdges = d_networkData.edges;
			this.topics = d_networkData.topics;
			// @ts-ignore
			this.users = d_users;
		}

		let agenda = 1;
		_.forEach(this.fullScript, (s) => {
			if (!_.has(s, 'agenda')) {
				s.agenda = agenda;
			} else {
				agenda = s.agenda;
			}
		});
		this.seperateCount = Math.floor(Math.sqrt(this.contents.length) * 2);

		const config = {
			speechCount: this.contents.length,
			speechGap: this.contents.length / this.seperateCount
		};
		this.config = config;

		this.totalTime =
			this.fullScript[this.fullScript.length - 1].endTime - this.fullScript[0].startTime;

		// set 아젠다
		this.agendas = this.getAgendas(this.totalNodes, this.topics, this.fullScript);

		// resize 노드 엣지
		this.totalNodes = this.resizeNodes(this.totalNodes, this.minNodeSize, this.maxNodeSize);
		this.totalEdges = this.resizeEdges(this.totalEdges, this.minEdgeWidth, this.maxEdgeWidth);

		// cut 마인드 맵
		this.networkData.nodes = this.cutNodes(this.totalNodes, this.numOfNodes);

		this.networkData.nodes = this.getColoredNodes(this.networkData.nodes, this.fullScript);

		this.nodeHash = _.keyBy(this.networkData.nodes, 'id');

		this.cutEdges(this.nodeHash);

		// draw 마인드 맵
		this.drawNetwork();
		// });
	}
	private makeUsersValidSpeechProperty(users: User[], speakingBias: number): User[] {
		users = _.sortBy(users, (user) => -user.name);
		// numOfValidSpeech 계산
		_.forEach(users, (user) => {
			_.forEach(user.speechPoints, (point, i) => {
				if (point.point.diff > speakingBias) {
					user.numOfValidSpeech += 1;
					// 1)fullScript(contents)의 startIndex와 lastIndex를 구한다.

					// const startIndex: number = Math.floor(this.config.speechGap * i);
					const startIndex: number = this.getStartIndexBySpeechPoint(i, this.config.speechGap);
					// const lastIndex: number = Math.floor(
					//   this.config.speechGap * (i + 1) - 1
					// );
					const lastIndex: number = this.getLastIndexBySpeechPoint(i, this.config.speechGap);

					// 2)this.fullScript[lastIndex].endTime - this.fullScript[startIndex].startTime
					const time: number =
						this.fullScript[lastIndex].endTime - this.fullScript[startIndex].startTime;
					user.validSpeechTime += time;
				}
			});
		});

		// 각 user마다 숫자가 나오는데, 몇번째인지 알려면 sorting이 되어야 한다.
		const rankSortedUsers: User[] = _.sortBy(users, (user) => -user.numOfValidSpeech);
		// validSpeech 랭킹 설정
		_.forEach(rankSortedUsers, (sortedUser, i) => {
			_.forEach(users, (user) => {
				if (user.name === sortedUser.name) {
					user.validSpeechRanking = i + 1;
				}
			});
		});
		return users;
	}
	private makeUsersSpeechTimeProperty(users: User[], fullScript: Script[]) {
		_.forEach(users, (user) => {
			_.forEach(fullScript, (script) => {
				if (script.talkerName === user.name) {
					user.speechTime += script.endTime - script.startTime;
				}
			});
		});
		// return _.reverse(users);
		return users;
	}

	// 노드 label 변경 함수
	private changeNodeLabel() {
		const oneNode: Node = this.getClickedNodeList()[0];
		oneNode.label = this.nodeLabelText;
		this.visNetworkData.nodes.update(oneNode);
		this.nodeLabelText = '';
		this.nodeLabelDialogOpened = false;
	}

	private async remakeMindmap() {
		this.destroyMindmap(this.network);

		this.agendas = this.getAgendas(this.totalNodes, this.topics, this.fullScript);

		// resize 노드 엣지
		this.totalNodes = this.resizeNodes(this.totalNodes, this.minNodeSize, this.maxNodeSize);
		this.totalEdges = this.resizeEdges(this.totalEdges, this.minEdgeWidth, this.maxEdgeWidth);
		this.networkData.nodes = this.cutNodes(this.totalNodes, this.numOfNodes);

		// cut 마인드 맵
		this.networkData.nodes = this.getColoredNodes(this.networkData.nodes, this.fullScript);

		this.nodeHash = _.keyBy(this.networkData.nodes, 'id');

		this.cutEdges(this.nodeHash);

		// draw 마인드 맵
		this.drawNetwork();
	}
	private destroyMindmap(network: vis.Network | null) {
		if (!_.isNil(network)) {
			network.destroy();
			network = null;
		}
		_.forEach(document.getElementsByClassName('vis-configuration-wrapper'), (htmlElement) => {
			htmlElement.innerHTML = '';
		});
	}

	private async makeMindmapByJsonString() {
		this.destroyMindmap(this.network);
		// this.topics = [];
		this.agendas = [];

		// this.fullScript를 만든다.
		const jsonObjects = JSON.parse(this.jsonString);
		// this.fullScript = jsonObjects.texts;
		this.fullScript = jsonObjects;
		_.forEach(this.fullScript, (script, i) => {
			script.agenda = Math.floor(i / (this.fullScript.length / 4)) + 1;
		});

		// rawString으로 만든다.
		const lines = _.chain(this.fullScript)
			.map((t) => {
				const spl = t.text
					.replace(/\n/gi, '')
					.replace(/ *\([^)]*\) */g, '')
					.split(':');

				if (spl.length <= 1) {
					return spl[0];
				} else {
					return spl[1].trim();
				}
			})
			.join('. ')
			.value();

		// vis-api에 rawString을 보내 요청한다.
		try {
			const ret = await axios.post(`http://localhost:4000/vis/mindmap`, {
				text: lines
			});

			// 돌아온 데이터로 networkData에 넣는다.
			this.networkData = ret.data;
			this.totalNodes = ret.data.nodes;
			this.totalEdges = ret.data.edges;
			this.topics = ret.data.topics;
		} catch (error) {
			console.error('axios error', error.response);
		}

		this.remakeMindmap();
	}

	private clickNode(): void {
		// 초기화
		this.displayScriptItems = [];
		this.displayKeywordItems = [];
		this.semiSelectedNodeIds = [];

		// 할당
		this.selectedNodeIds = (this.network as vis.Network).getSelectedNodes();

		if (!_.isNil(this.network)) {
			if (this.selectedNodeIds.length === 0) {
				return;
			} else if (this.selectedNodeIds.length === 1) {
				const clickedNode: Node = this.visNetworkData.nodes.get(this.selectedNodeIds[0]) as Node;
				this.selectedKeyword = (clickedNode as Node).label;
				this.displayKeywordItems = [
					{
						label: (clickedNode as Node).label,
						barRatio: 100,
						count: 0
					}
				];
				this.displayKeywordItems = _.concat(
					this.displayKeywordItems,
					_.chain(this.networkData.edges)
						.filter((e) => e.from === clickedNode.id || e.to === clickedNode.id)
						.map((e) => {
							if (e.from === clickedNode.id) {
								const keyword: Node = _.filter(this.networkData.nodes, (n) => n.id === e.to)[0];
								return {
									count: e.count,
									label: keyword.label
								};
							} else {
								const keyword: Node = _.filter(this.networkData.nodes, (n) => n.id === e.from)[0];
								return {
									count: e.count,
									label: keyword.label
								};
							}
						})
						.sortBy((n) => -n.count)
						.map((e, i) => {
							return {
								count: e.count,
								label: e.label,
								barRatio: 0
							};
						})
						.value()
				);
				let totalCount: number = 0;
				_.forEach(this.displayKeywordItems, (item, i) => {
					totalCount += item.count;
				});
				this.displayKeywordItems[0].count = totalCount;
				_.forEach(this.displayKeywordItems, (item, i) => {
					item.barRatio = (item.count / totalCount) * 100;
				});
				this.displayScriptItems = this.findScriptItems([clickedNode]);
			} else {
				const clickedNodes = this.getClickedNodeList();
				this.displayKeywordItems = this.findKeywordItems(clickedNodes);
				this.displayScriptItems = this.findScriptItems(clickedNodes);
			}
		}
	}

	private clickTopic(topic: Topic) {
		// 노드를 찾는다.
		let findingNode!: Node;
		_.forEach(this.networkData.nodes, (node) => {
			if (node.label === topic.label) {
				findingNode = node;
				return false;
			}
		});
		// 찾은 노드를 선택시킨다
		(this.network as vis.Network).setSelection({
			nodes: [findingNode.id],
			edges: []
		});

		this.selectedKeyword = findingNode.label;

		// 키워드와 스크립트를 찾는다.
		this.displayKeywordItems = this.findKeywordItems([findingNode]);
		this.displayScriptItems = this.findScriptItems([findingNode]);
	}

	private clickScriptKeyword(clickedId: string) {
		// 선택된 노드아이디 중에서 클릭된 아이디가 있다면
		if (_.indexOf(this.selectedNodeIds, clickedId) >= 0) {
			// 임시 배열에다 넣어둔다.
			this.semiSelectedNodeIds.push(clickedId);
			_.remove(this.selectedNodeIds, (id) => id === clickedId);
		} else {
			// 다시 원래 배열에 넣고, 임시배열에서 뺀다.
			this.selectedNodeIds.push(clickedId);
			_.remove(this.semiSelectedNodeIds, (id) => id === clickedId);
		}

		const clickedNodes = this.getClickedNodeList();
		this.displayScriptItems = this.findScriptItems(clickedNodes);
	}

	private findKeywordItems(clickedNodes: Node[]): DisplayKeywordItem[] {
		// hash로 한번 처리한다.
		const keywordHash: { [index: string]: DisplayKeywordItem } = {};
		// 클릭된 node들을 hash에 넣는다.
		_.forEach(clickedNodes, (node) => {
			keywordHash[node.id] = {
				label: node.label,
				barRatio: 0,
				count: 0
			};
		});

		// 각 node마다 keyword를 찾는다.
		_.forEach(clickedNodes, (clickedNode) => {
			const filteredEdges: Edge[] = _.filter(
				this.networkData.edges,
				(e) => e.from === clickedNode.id || e.to === clickedNode.id
			);
			keywordHash[clickedNode.id].count = filteredEdges.length;
			_.forEach(filteredEdges, (e) => {
				// keyword
				let keyword: Node;
				if (e.from === clickedNode.id) {
					keyword = this.visNetworkData.nodes.get(e.to) as Node;
				} else {
					keyword = this.visNetworkData.nodes.get(e.from) as Node;
				}

				if (!_.isNil(keywordHash[keyword.id])) {
					keywordHash[keyword.id].count += keyword.count;
				} else {
					keywordHash[keyword.id] = {
						count: e.count,
						label: keyword.label,
						barRatio: 0
					};
				}
			});
		});

		let displayKeywordItems: DisplayKeywordItem[] = _.values(keywordHash);
		displayKeywordItems = _.sortBy(displayKeywordItems, (item) => -item.count);
		let totalCount: number = 0;
		_.forEach(displayKeywordItems, (item, i) => {
			if (i === 0) {
				totalCount = item.count;
			}
			item.barRatio = (item.count / totalCount) * 100;
		});
		return displayKeywordItems;
	}

	private findScriptItems(clickedNodes: Node[]) {
		const mergedTextLen = 5;
		const highlightScriptIndexs: number[] = this.getHighlightScriptIndex(
			this.fullScript,
			clickedNodes,
			mergedTextLen
		);

		return this.getScriptItem(highlightScriptIndexs, clickedNodes, mergedTextLen);
	}

	private getHighlightScriptIndex(script: Script[], selectedNodes: Node[], mergedTextLen: number) {
		// 모든 선택된노드가 있는 첫 문장 index를 담은 배열
		const ret: number[] = [];
		for (let i = 0; i < script.length - mergedTextLen; i++) {
			let mergedText: string = '';
			// 텍스트를 한 문장씩 합치는 도중
			for (let j = 0; j < mergedTextLen; j++) {
				mergedText += ' / ' + this.fullScript[i + j].text;
			}
			// 문장에서 노드가 다 있는 경우
			let hasAllSelectedNodes: boolean = true;

			// tslint:disable-next-line: prefer-for-of
			for (let j = 0; j < selectedNodes.length; j++) {
				if (mergedText.indexOf(selectedNodes[j].label) === -1) {
					hasAllSelectedNodes = false;
					break;
				}
			}

			if (hasAllSelectedNodes) {
				ret.push(i);
				i = i + mergedTextLen - 1;
			}
		}
		return ret;
	}

	private getScriptItem(
		highlightScriptIndexs: number[],
		selectedNodes: Node[],
		mergedTextLen: number
	) {
		const ret: DisplayScriptItem[] = [];
		_.forEach(highlightScriptIndexs, (idx) => {
			let mergedText: string = this.fullScript[idx].text + '. ';
			let talker: string = this.fullScript[idx].talkerName;
			let replaced = '';
			for (let j = 1; j < mergedTextLen; j++) {
				if (talker === this.fullScript[idx + j].talkerName) {
					mergedText += this.fullScript[idx + j].text + '. ';
					if (j === mergedTextLen - 1) {
						replaced = mergedText;
						for (const node of selectedNodes) {
							const reg = new RegExp(`${node.label}`, 'gi');
							replaced = replaced.replace(reg, `<b>${node.label}</b>`);
						}
						ret.push({
							talker,
							text: replaced,
							time:
								Math.floor(this.fullScript[idx + j].startTime / 60000) +
								':' +
								Math.floor((this.fullScript[idx + j].startTime % 60000) / 1000),
							profileImage: ''
						});
					}
				} else {
					replaced = mergedText;
					for (const node of selectedNodes) {
						const reg = new RegExp(`${node.label}`, 'gi');
						replaced = replaced.replace(reg, `<b>${node.label}</b>`);
					}
					ret.push({
						talker,
						text: replaced,
						time:
							Math.floor(this.fullScript[idx + j].startTime / 60000) +
							':' +
							Math.floor((this.fullScript[idx + j].startTime % 60000) / 1000),
						profileImage: ''
					});
					talker = this.fullScript[idx + j].talkerName;
					mergedText = this.fullScript[idx + j].text + '. ';
					if (j === mergedTextLen - 1) {
						replaced = mergedText;
						for (const node of selectedNodes) {
							const reg = new RegExp(`${node.label}`, 'gi');
							replaced = replaced.replace(reg, `<b>${node.label}</b>`);
						}
						ret.push({
							talker,
							text: replaced,
							time:
								Math.floor(this.fullScript[idx + j].startTime / 60000) +
								':' +
								Math.floor((this.fullScript[idx + j].startTime % 60000) / 1000),
							profileImage: ''
						});
					}
				}
			}
		});
		// 시간 오름차순 정렬
		const sortedRet: DisplayScriptItem[] = _.sortBy(ret, ['time']);
		return sortedRet;
	}

	private getClickedNodeList() {
		// 2개 이상 선택 시
		// tslint:disable-next-line: prefer-for-of
		const clickedNodes: Node[] = [];
		for (const nodeId of this.selectedNodeIds) {
			const nodeInstance: Node = this.visNetworkData.nodes.get(nodeId) as Node;
			clickedNodes.push(nodeInstance);
		}
		return clickedNodes;
	}

	private onClickNetworkConfig() {
		this.isConfigOpened = !this.isConfigOpened;
	}

	private onCLickSideviweButton(mode: string) {
		console.log(mode);
		this.sideviewMode = mode;
	}

	private clickTaskCard(task: ActionItem) {
		task.selected = !task.selected;
	}

	private clickImageCard(imgUrl: string) {
		console.log(imgUrl);
	}

	private startAnalysis() {
		console.log('미 구현');
	}

	/**
	 * nodes를 len 길이만큼 자릅니다. node의 size를 기준으로 자릅니다.
	 * @param nodes :Node[]
	 * @param len :number
	 */
	private cutNodes(nodes: Node[], len: number) {
		const sorted = _.sortBy(nodes, (e) => -e.size);
		return sorted.slice(0, len);
	}

	private getColoredNodes(nodes: Node[], scripts: Script[]) {
		for (const node of nodes) {
			node.agenda = this.getAgendaOfLabel(node.label, scripts);
		}
		return nodes;
	}

	private getAgendas(nodes: Node[], topics: Topic[], scripts: Script[]): Agenda[] {
		const agendas = {};
		_.forEach(scripts, (script, i) => {
			if (!_.has(agendas, script.agenda)) {
				agendas[script.agenda] = {
					name: script.agenda,
					topics: [],
					startTime: script.startTime,
					endTime: script.endTime,
					startIndex: i,
					endIndex: i
				};
			} else {
				agendas[script.agenda].startTime = Math.min(
					agendas[script.agenda].startTime,
					script.startTime
				);
				agendas[script.agenda].endTime = Math.max(agendas[script.agenda].endTime, script.endTime);
				agendas[script.agenda].endIndex = i;
			}
		});

		for (const topic of topics) {
			const topicAgenda = this.getAgendaOfLabel(topic.label, scripts);
			agendas[topicAgenda].topics.push(topic);
		}

		return _.values(_.sortBy(agendas, 'name'));
	}

	private getAgendaOfLabel(label: string, scripts: Script[]) {
		const agendaCnt = Array(10).fill(0);
		// console.log(scripts);
		for (const script of scripts) {
			if (script.text.includes(label)) {
				agendaCnt[script.agenda] += 1;
			}
		}
		const maxVal = _.max(agendaCnt);
		const maxIndex = agendaCnt.indexOf(maxVal);
		return maxIndex;
	}

	private getAgendasTimeLength(agenda: Agenda, agendaIndex: number): number {
		return ((agenda.endIndex - agenda.startIndex) / this.fullScript.length) * 100;
	}

	/**
	 * 엣지를 입력 노드를 기준으로 자릅니다.
	 * 입력한 노드 배열과 관련 있는 엣지만을 반환합니다.
	 *  @param nodes: Node
	 */
	private cutEdges(nodeHash: { [id: string]: Node }) {
		// const nodeHash = _.keyBy(nodes, 'id');
		this.networkData.edges = _.filter(this.totalEdges, (edge) => {
			return !_.isNil(nodeHash[edge.from]) && !_.isNil(nodeHash[edge.to]);
		});
	}

	private resizeNodes(nodes: Node[], minSize: number, maxSize: number) {
		// @ts-ignore
		const minVal = _.maxBy(nodes, (n) => -n.size).size;
		// @ts-ignore
		const maxVal = _.maxBy(nodes, 'size').size;

		const ratio = (maxSize - minSize) / (maxVal - minVal);
		_.forEach(nodes, (node) => {
			node.size = (node.size - minVal) * ratio + minSize;
			// @ts-ignore
			node.font.size = node.size;
		});

		return nodes;
	}

	private resizeEdges(edges: Edge[], minSize: number, maxSize: number) {
		// @ts-ignore
		const minVal = _.maxBy(edges, (n) => -n.width).width;
		// @ts-ignore
		const maxVal = _.maxBy(edges, 'width').width;

		const ratio = (maxSize - minSize) / (maxVal - minVal);
		_.forEach(edges, (edge) => {
			edge.width = (edge.width - minVal) * ratio + minSize;
		});

		return edges;
	}

	private clickImage(url) {
		this.ui.selectedImageUrl = url;
		this.ui.imageDialog = true;
	}

	private drawNetwork() {
		const container: HTMLElement = document.getElementById('mindmap') as HTMLElement;
		const options: any = {
			nodes: {
				shape: 'dot',
				borderWidth: 2
			},
			edges: {
				smooth: {
					type: 'straightCross',
					forceDirection: 'none',
					roundness: 0.9
				},
				color: {
					color: '#53a4e3',
					highlight: '#53a4e3'
					// opacity: 0.3
				}
			},
			physics: {
				forceAtlas2Based: {
					gravitationalConstant: -200,
					centralGravity: 0.025,
					springLength: 50,
					springConstant: 1.5,
					damping: 1.0,
					avoidOverlap: 1.0
				},
				solver: 'forceAtlas2Based',
				minVelocity: 0.75,
				timestep: 0.15
			},
			configure: {
				filter(option, path) {
					if (path.indexOf('physics') !== -1) {
						return true;
					}
					if (path.indexOf('smooth') !== -1 || option === 'smooth') {
						return true;
					}
					return false;
				},
				container: document.getElementById('config')
			},
			interaction: { multiselect: true }
		};
		_.forEach(this.networkData.nodes, (node) => {
			node.color = {
				border: this.color.node_border_agenda[(node.agenda as number) - 1],
				background: this.color.node_agenda[(node.agenda as number) - 1],
				highlight: {
					// border: this.color.node_border_agenda[(node.agenda as number) - 1],
					border: this.color.node_highlight_border_agenda[(node.agenda as number) - 1],
					background: this.color.node_highlight_agenda[(node.agenda as number) - 1]
				}
			};
		});
		_.forEach(this.networkData.edges, (edge) => {
			if (this.nodeHash[edge.from].size >= this.nodeHash[edge.to].size) {
				edge.color = {
					color: this.color.node_border_agenda[(this.nodeHash[edge.from].agenda as number) - 1],
					highlight:
						this.color.node_highlight_agenda[(this.nodeHash[edge.from].agenda as number) - 1],
					opacity: 0.5
				};
			} else {
				edge.color = {
					color: this.color.node_border_agenda[(this.nodeHash[edge.to].agenda as number) - 1],
					highlight:
						this.color.node_highlight_agenda[(this.nodeHash[edge.to].agenda as number) - 1],
					opacity: 0.5
				};
			}
		});
		this.visNetworkData.nodes = new vis.DataSet(this.networkData.nodes);
		this.visNetworkData.edges = new vis.DataSet(this.networkData.edges);

		this.network = new vis.Network(container, this.visNetworkData, options);

		this.network.on('doubleClick', (properties) => {
			if (properties.nodes.length === 1) {
				const clickedNodeId: string = properties.nodes[0];
				this.nodeLabelText = (this.visNetworkData.nodes.get(clickedNodeId) as Node).label;
				this.nodeLabelDialogOpened = true;
			}
		});

		this.network.once('stabilizationIterationsDone', () => {
			console.log('네트워크 그리기 완료.');
		});
	}

	private makeTimeMinuteUnit(time: number): string {
		return Math.floor(time / 60000) + ':' + Math.floor((time % 60000) / 1000);
	}

	private getActionItemLeftPosition(actionItem: ActionItem) {
		const timeRatio: number = actionItem.time / this.totalTime; // totalTime

		const totalWidth: number = document.getElementsByClassName('user-speak-area')[0].clientWidth;
		const speakerWidth: number = document.getElementsByClassName('speaker-space')[0].clientWidth;
		const left: number = speakerWidth + 25 + timeRatio * (totalWidth - 25 - speakerWidth);
		// magic number 25 => v-image width

		return left;
	}

	private getActionItemHeight(): number {
		const height: number = document.getElementsByClassName('user-speak-area')[0].clientHeight;
		return document.getElementsByClassName('user-speak-area')[0].clientHeight;
	}

	private clickSpeakLineBlock(clickedUser: User, speechPointIndex: number) {
		// 진한 회색 블록이 선택되었을 때
		if (clickedUser.speechPoints[speechPointIndex].point.diff > this.speakingBias) {
			// 주변 진한 회색 블록을 찾는다.
			const sameBlockIndexes: number[] = this.findSameBlockAround(clickedUser, speechPointIndex);

			// 해당 fullScript의 시작 index와 마지막 index를 찾는다.
			const scripts: Script[] = this.getScriptsBySpeechPoint(
				sameBlockIndexes[0],
				sameBlockIndexes[sameBlockIndexes.length - 1]
			);

			// 발화자 기준으로 스크립트를 묶을 수 있도록 한다.
			this.displayScriptItems = this.getDisplayScriptItemsByTalker(scripts);
		}
	}

	/**
	 * 주변 진한 회색블록들의 모든 index들을 오름차순으로 반환한다.
	 */
	private findSameBlockAround(clickedUser: User, speechPointIndex: number): number[] {
		//
		const sameBlockIndexes: number[] = [speechPointIndex];
		let i = speechPointIndex - 1;
		while (i >= 0 && clickedUser.speechPoints[i].point.diff > this.speakingBias) {
			sameBlockIndexes.push(i);
			i--;
		}

		let j = speechPointIndex + 1;
		while (j < this.seperateCount && clickedUser.speechPoints[j].point.diff > this.speakingBias) {
			sameBlockIndexes.push(j);
			j++;
		}

		sameBlockIndexes.sort((a, b) => (a < b ? -1 : 1));
		return sameBlockIndexes;
	}

	/**
	 * speechPoint에 따른 startIndex와 lastIndex를 가지고
	 * fullScript 중 Script[]를 가져온다.
	 */
	private getScriptsBySpeechPoint(spStartIndex: number, spLastIndex: number): Script[] {
		const fsStartIndex: number = this.getStartIndexBySpeechPoint(
			spStartIndex,
			this.config.speechGap
		);
		const fsLastIndex: number = this.getLastIndexBySpeechPoint(spLastIndex, this.config.speechGap);

		const scripts: Script[] = [];

		for (let i = fsStartIndex; i <= fsLastIndex; i++) {
			scripts.push(this.fullScript[i]);
		}

		return scripts;
	}

	/**
	 * 발화자 기준으로 DisplayScriptItem[]를 묶어 반환한다.
	 * @param scripts: DisplayScriptItem[]를 만들기 위한 Script[]
	 */
	private getDisplayScriptItemsByTalker(scripts: Script[]) {
		const displayScriptItems: DisplayScriptItem[] = [];
		let displayScriptItem: DisplayScriptItem = {
			profileImage: scripts[0].talkerId,
			talker: scripts[0].talkerName,
			time: this.makeTimeMinuteUnit(scripts[0].startTime),
			text: scripts[0].text
		};

		for (let i = 1; i < scripts.length; i++) {
			if (scripts[i - 1].talkerId === scripts[i].talkerId) {
				displayScriptItem.text += ` ${scripts[i].text}`;
			} else {
				// talker가 다른 경우
				displayScriptItems.push(displayScriptItem);
				// displayScriptItem를 새로 만든다.
				displayScriptItem = {
					profileImage: scripts[i].talkerId,
					talker: scripts[i].talkerName,
					time: this.makeTimeMinuteUnit(scripts[i].startTime),
					text: scripts[i].text
				};
			}
		}
		displayScriptItems.push(displayScriptItem);
		return displayScriptItems;
	}

	private getStartIndexBySpeechPoint(spStartIndex: number, speechGap: number) {
		return Math.floor(spStartIndex * speechGap);
	}
	private getLastIndexBySpeechPoint(spLastIndex: number, speechGap: number) {
		return Math.floor((spLastIndex + 1) * speechGap - 1);
	}
}
