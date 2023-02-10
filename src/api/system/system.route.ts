import express from 'express'

const router = express.Router()

router.get('/ping', (_, res) => {
  res.send({ ping: 'pong' })
})

export default router

/**
 * @swagger
 * tags:
 *   name: システム
 *   description: アプリケーションの動作に関するAPI
 */

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: 応答を返す
 *     description: アクセスしたら応答を返します
 *     tags: [システム]
 *     responses:
 *       "200":
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ping:
 *                   type: string
 *                   example: pong
 */
