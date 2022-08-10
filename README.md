# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte

# create a new project in my-app
npm init svelte my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Firebase

npm i -g firebase-tools

## Svelte

routes 폴더 안 하위폴더가 하나의 페이지가 됨 . ex) calculator folder = /calculator

## 220727 과제

컴포넌트 <- 재사용성, 확장성

1. 바그래프 html, svg
Svelte > HTML 본인 소스를 컴포넌트로 변경

1. svg: 직선, path: 곡선 

2. 팀프로젝트 - 미디어융합연구: 대학원과 합동연구

다음주 목요일 수업: 온라인 -> 시간 아직 미정

3. 현장실습 
- 8월 10일

## 0803
오늘부터 수업 난이도가 올라갈 수 있음.

오늘의 수업: 개발수업, 아이디어논의

네트워크 요청 (http -> 1회성)

Socket: 실시간

Client Side: Svelte App

Server: 서비스 제공자

데이터를 요청하여 해당 데이터 바탕으로 그래프를 그린다.

비동기 처리방식 Java, C++ Thread,

JS, Node: SingleThread Event

function a(callback) { //요청 네트워크

//작업이 끝나면 콜백 callback(); }

a((v) => {

})


