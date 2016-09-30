/**
 * Created by Mortoni on 19/11/13.
 *
 * configuration data
 */
module.exports = {
  port: 3000,
  polltime: 4,
  timecount: 60,
  databaseURI : "localhost:27017/logger",
  collections : ["messages", "diffs"],
  feeds :  [
        { title: "mst", type: "xml", url: 'http://scoring.mstworld.tv/xml/rydercup.xml' },
        { title: "leeds", type: "json", url: 'http://uatd.365dm.com/api/score-centre/v1/golf/leaderboard/1484' },
        { title: "ssn", type : "json", url: 'http://ssn-hq.broadcast.bskyb.com/SSNApps/GolfRyderCupExt/api/golfevents/getformatchplayasxml?id=397&day=1&matchType=1'}
        ]
};