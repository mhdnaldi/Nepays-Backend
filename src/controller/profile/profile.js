const { getUserById, getUserFullById, patchPersonal, getPhone, getImage, patchProfileImage } = require('../../model/profile')
const helper = require('../../helper/index')
const fs = require('fs')

module.exports = {

  get_profile: async (request, response) => {
    try {
      const { id_user_login } = request.body
      const result = await getUserById(id_user_login)
      if (result.length > 0) {
        return helper.response(response, 200, 'Get Profile success', result)
      } else {
        return helper.response(response, 404, 'Please Login')
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  get_personal: async (request, response) => {
    try {
      const { id_user_login } = request.body
      const result = await getUserFullById(id_user_login)
      if (result.length > 0) {
        return helper.response(response, 200, 'Get Personal success', result)
      } else {
        return helper.response(response, 404, 'Please Login')
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  patch_personal_name: async (request, response) => {
    try {
      const { id_user_login, first_name, last_name } = request.body
      const setData = {
        first_name: first_name,
        last_name: last_name
      }
      if (first_name === '' || last_name === '' || first_name === null || last_name === null) {
        return helper.response(response, 200, 'Name cannot be null')
      } else {
        await patchPersonal(id_user_login, setData)
        return helper.response(response, 200, 'Patch Personal success', setData)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  patch_personal_phone: async (request, response) => {
    try {
      const { id_user_login, phone } = request.body
      const setData = {
        phone: phone
      }
      const checkPhone = await getPhone(phone)
      if (checkPhone.length > 0) {
        return helper.response(response, 400, 'Phone already registered')
      } else if (phone === '' || phone === null) {
        return helper.response(response, 400, 'Phone require')
      } else {
        const result = await patchPersonal(id_user_login, setData)
        return helper.response(response, 200, 'Patch Personal Success', result)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  patch_profile_image: async (request, response) => {
    try {
      let { id_user_login, image } = request.body
      const id_user = await getImage(id_user_login)

      if (!request.file) {
        image = id_user[0].image
      } else if (request.file && id_user[0].image === 'blank-user.png') {
        image = request.file.filename
      } else if (request.file && id_user[0].image !== 'blank-user.png') {
        fs.unlink(`./uploads/${id_user[0].image}`, () => { })
        image = request.file.filename
      }
      const setData = {
        image: image
      }
      const edit_image = await patchProfileImage(id_user_login, setData)
      return helper.response(response, 200, 'Update profile success', edit_image)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }

}
