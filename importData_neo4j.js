// 이 프로그램은 크롤링하여 수집한 데이터를 그래프 데이터베이스인 neo4j에 넣는 역할을 합니다.
// 우선 아래와 같이 npm을 이용해 neo4j 패키지를 설치합니다.
// sudo npm install neo4j@1.x --save
// (https://github.com/thingdom/node-neo4j)

var neo4j = require('neo4j');
require('./math.js');
require('./string.js');

var db = new neo4j.GraphDatabase('http://localhost:7474');
var ImagesList = require('./data.json');

function createImageNode(Image){
	console.log("Start to insert: " + Image._id);

	// 이미지 노드를 만듭니다.
	db.query('CREATE (i:Image {_id: {_id}, originalImageUrl: {originalImageUrl}, thumbnailImageUrl: {thumbnailImageUrl}})', {
		_id: Image._id,
		originalImageUrl: Image.originalImageUrl,
		thumbnailImageUrl: Image.thumbnailImageUrl,
	  }, function(err){
		if(err) throw err;

		// 이미지 노드를 넣는데 성공했습니다. 이제 태그를 넣을 차례입니다.
		Image.tags.forEach(function(tag){
			// 이미지에 달려있는 각 태그마다, 그 태그가 혹시 그래프 내에 존재하는지 확인합니다.
			db.query('MATCH (t:Tag) WHERE t.word={tag} return t',{
				tag:tag.word
			}, function(err, results){
				if(err) throw err;

				if(results.length!=0){
					// 그래프 내 같은 태그가 있으면, 노드는 만들지 않고 (기존노드)-[관계]-(이미지) 관계만 만듭니다.
					tagObj = results.map(function (result){
						return result['t'];
					});
					tagObj = tagObj[0]._data.data;

					db.query('MATCH (t:Tag), (i:Image) WHERE t._id={tagId} AND i._id={ImgId} CREATE (t)-[r:Weight{score:{weight}}]->(i)', {
						tagId: tagObj._id,
						ImgId: Image._id,
						weight: 1
					}, function(err){
						if(err) throw err;
					});

				}else{
					// 그래프 내에 같은 태그가 없으면, 태그 노드와 edge 모두 생성합니다.
					db.query('MATCH (i:Image) WHERE i._id={ImgId} CREATE (t:Tag { _id:{_id}, word:{word} } ), (t)-[:Weight{score:{weight}}]->(i) return t', {
						_id: String.generate(), //tag에도 id 부여할 필요가 있나 근데 =_= ㅋ
						ImgId: Image._id,
						word: tag.word,
						weight: tag.score
					}, function(err, result){
						if(err) throw err;
						console.dir(result);
					});
				}
			});
		});	
	  });
}

// 데이터를 초기화 시켜줍니다.
db.query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r', {}, function(err, results){
	if(err) throw err;
	console.log('delete success');

	var i=0;
	for(i=0;i<ImagesList.length;i++){
		createImageNode(ImagesList[i]);
	}
});
