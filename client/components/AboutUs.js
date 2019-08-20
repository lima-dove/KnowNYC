import React from 'react'

/**
 * COMPONENT
 */
const AboutUs = () => {
  return (
    <div>
      <h1>About Us</h1>
      <h3>Origin Story</h3>
      <p>
        KnowNYC began as a member of our team was apartment searching after
        finding out too late about all the chronic issues his current building
        suffered. Had there only been an easy map that layed out all the most
        common problems in each building, they might have never moved to that
        building in the first place!
      </p>
      <h3>The Team</h3>
      <div id="team">
        <a href="https://www.linkedin.com/in/danielharriswasserman/">
          <img
            src="https://media.licdn.com/dms/image/C4E03AQEuHdBw4OYRQw/profile-displayphoto-shrink_800_800/0?e=1571875200&v=beta&t=hpnAi34cd08on2hZHWp7jPBH33A6p7jITPu06sX3kH0"
            style={{height: '120px', width: '120px'}}
          />
        </a>
        <a href="https://www.linkedin.com/in/jennifer-scheinhorn/">
          <img
            src="https://media.licdn.com/dms/image/C4E03AQHuFYA6LqIXMQ/profile-displayphoto-shrink_800_800/0?e=1571875200&v=beta&t=u5gFdHe2DFwSGP-iwBCe8pizUBzTfGKLndOtJC48R1I"
            style={{height: '120px', width: '120px'}}
          />
        </a>
        <a href="https://www.linkedin.com/in/noahschefer">
          <img
            src="https://media.licdn.com/dms/image/C5603AQH5abIAlQHgrw/profile-displayphoto-shrink_800_800/0?e=1571875200&v=beta&t=OepJIMdyG9vvuId5tVOe97aeyI946HplLPPe_UsPHgk"
            style={{height: '120px', width: '120px'}}
          />
        </a>
        <a href="https://www.linkedin.com/in/svetlanashinkarnyl/">
          <img
            src="https://media.licdn.com/dms/image/C5603AQFZw8zmeTcHkw/profile-displayphoto-shrink_800_800/0?e=1571875200&v=beta&t=udlieQf4nfxR9DALQcYEitTm5nkEJ3Izuavu3fL7vck"
            style={{height: '120px', width: '120px'}}
          />
        </a>
      </div>
    </div>
  )
}

export default AboutUs
