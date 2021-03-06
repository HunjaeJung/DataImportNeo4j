##### 해당 프로그램은 이미지/태그 정보를 담고 있는 json 파일을 그래프 데이터베이스인 neo4j에 import하는 역할을 합니다.

- node.js로 작성되었으며 [node-neo4j 패키지](https://github.com/thingdom/node-neo4j)가 필요하여 아래와 같이 npm을 이용해 패키지를 설치합니다. node-neo4j를 사용하는 방법은 [Document](http://coffeedoc.info/github/thingdom/node-neo4j/master/)를 참고하세요.

	``
	sudo npm install neo4j@1.x --save
	``
- 설치 후 아래와 같이 입력하면 localhost:7474로 실행되어있는 neo4j로 데이터가 들어갑니다.
	
	``
	node importData_neo4j.js
	``
- 주의해야할 점 
	1. (당연하게도) 프로그램 실행전에 먼저 [neo4j start](http://neo4j.org)가 되어있어야한다는 점 입니다.
	2. 프로그램을 실행하면 기존에 들어가있던 데이터를 모두 지운뒤, 다시 넣습니다. 이는 65번째 라인부터 시작하는 query문을 지운뒤, createImageNode(Image)만 실행해서 기존의 데이터 위에 데이터를 추가할 수 있습니다.

- 참고 및 이슈
	1. 위의 패키지가 batch support가 되지않고, 커피스크립트로 작성되어있다는 이유로 [새로운 node-neo4j 프로젝트](https://github.com/bretcope/neo4j-js)도 있습니다. 
	2. [neo4j도 elastic search와 rivering](https://github.com/sksamuel/elasticsearch-river-neo4j)이 가능합니다. 사용법은 차근차근 알아가보겠습니다.