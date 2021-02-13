const { scrap, post, user, movie } = require("../models");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");

module.exports = {
  post: async (req, res) => {
    try {
      const { userId, postId } = req.body;
      // body에 담긴 정보에 누락된 것이 있다면 에러메시지
      if (!userId || !postId) {
        res.status(400).json({ data: null, message: "should send full data" });
      }
      let [result, created] = await scrap.findOrCreate({
        where: { userId, postId },
        defaults: {
          userId,
          postId,
        },
      });
      // 데이터가 존재하지 않는 경우, 새로 생성하고 결과로 보내줌
      if (created) {
        res.status(200).json({ data: result, message: "ok" });
      } else {
        // 데이터가 존재할 경우, 이미 있는 데이터라고 메시지 보내줌
        res.status(400).json({ data: null, message: "Data already exists" });
      }
    } catch (err) {
      console.errer(err);
    }
  },
  getScrapById: async (req, res) => {
    try {
      const query = req.query;
      // 쿼리에 user_id가 담겨있다면
      if (query.user_id) {
        // 해당 유저가 스크랩한 post의 모든 정보들을 가져온다.
        const scrapByUser = await scrap.findAll({
          attributes: ["postId"],
          include: [
            {
              model: post,
              attributes: [
                "text",
                "rate",
                "createdAt",
                [
                  sequelize.fn("COUNT", sequelize.col("post.scraps.id")),
                  "scrap",
                ],
              ],
              include: [
                { model: scrap, attributes: [] },
                { model: user, attributes: ["nickname", "image"] },
                {
                  model: movie,
                  attributes: ["title", "image", "genre"],
                },
              ],
            },
          ],
          group: ["scrap.id"],
          where: { userId: query.user_id },
        });
          res.status(200).json({ data: scrapByUser, message: "ok" });
      }
    } catch (err) {
      console.errer(err);
    }
  },
  deleteScrap: async (req, res) => {
    try {
      const { userId, postId } = req.body;
      // body에 담긴 정보에 누락된 것이 있다면 에러메시지
      if (!userId || !postId) {
        res.status(400).json({ data: null, message: "should send full data" });
      }
      // 데이터 삭제
      const scrapDelete = await scrap.destroy({
        where: { userId, postId },
      });
      if (scrapDelete) {
        // 성공적으로 삭제된 경우 응답에 전송
        res.status(200).json({ data: scrapDelete, message: "delete success" });
      }
      // 삭제가 되지 않을 경우 에러메시지
      res.status(400).json({ data: null, message: "There's no such data" });
    } catch (err) {
      console.errer(err);
    }
  },
};
