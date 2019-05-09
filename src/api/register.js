import request from '@/utils/request'
const api_name = 'user'
export default {
  register(user) {
    return request({
      url: `/${api_name}/register`,
      method: 'post',
      data: user
    })
  }
  
 
  
}

