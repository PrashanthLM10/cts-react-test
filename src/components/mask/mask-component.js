import React, { useState } from "react";
import "./mask-component.css";
import topBarImg from "../../assets/fa-top-bar.jpg";
import contentImg from "../../assets/wembley-img.jpg";
import footerImg from "../../assets/fa-footer-img.jpg";
import { DialogContent, Slide, TextField, Dialog } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Mask(props) {
  const [ openPinDialog, setDialogVisibility ] = useState(false);
  const pin = process.env.NODE_ENV === 'development' ? '' : process.env.SECRET_PIN;
  const handleChange = e => {
    if(pin === e.target.value) props.setShowMessages(true)
  }

  const showPinDialog = () => {
    console.log(pin);
    if(!!pin) {
      setDialogVisibility(true);
    } else {
      props.setShowMessages(true);
    }
  }

  return (
    <section className="mask-ctr">
      <section className="top-bar">
        <img src={topBarImg} alt="logo" />
      </section>
      <section className="mask-content">
        <h1 class="article-title">The FA Strategic Plan 2020-2024 </h1>
        <img src= {contentImg} alt="logo" />
        <section className="article-content">
          <div>
            <p>
              <strong>
                We are proud to showcase Time for Change, the FA’s strategy for
                the 2020-2024 cycle.
              </strong>
            </p>
            <p>
              <strong>&nbsp;</strong>Our new plan aims to take the FA and
              English football forward with bold leadership and ambitious
              targets to build on the progress of the past four <span onClick={showPinDialog}>years</span>. 
            </p>
            <p>
              We cannot do it alone. Our vision remains to bring all parts of
              the game even closer together and leave a nation inspired.
            </p>
            <p>
              We have a unique ability to unite all parts of society – just cast
              your mind back to Russia 2018 or France 2019, when men's and
              women's FIFA World Cup fervour gripped the nation.
            </p>
            <p>
              Using our people and culture as the catalyst, we achieved some
              amazing things on our mission to rebuild the FA as a world class
              organisation - from doubling participation in the women's and
              girls’ game to registering more than one million of our grassroots
              players online – a material step into the digital age.
            </p>
            <p>
              Looking towards 2024, our strategic plan builds on those strong
              foundations.
            </p>
            <p>
              We've set out our six Game Changer objectives and eight Serve the
              Game objectives. These demonstrate our determination to
              substantially change the fabric of the game and address key
              societal issues.
            </p>
            <p>
              In England, football must be a game where the opportunities for
              every girl to play are the same as for every boy. A game in which,
              wherever you live, you have easy access to a great, affordable
              facility on which to play. A game run by the latest digital tools
              – easily administered from a phone as part of everyday life,
              lessening the burden on our wonderful volunteers.
            </p>
            <p>
              Football must be a game which embraces diversity and battles
              discrimination. Everyone must be made to feel welcome on our
              pitches and our terraces.
            </p>
            <p>
              Discrimination is an unacceptable societal issue that football
              must play a key role in tackling.
            </p>
            <p>
              A game where our competitions, led by the Emirates FA Cup,
              Vitality Women’s FA Cup and the Barclays Women’s Super League,
              continue to be valued and revered at home and abroad.
            </p>
            <p>
              Nothing would unite the country more than celebrating a major
              tournament victory by a senior England team. We must create the
              best chance for this to happen, through world class support and a
              seamless player pathway.
            </p>
            <p>
              In delivering this strategy, we'll seize on the remarkable
              togetherness and resilience our national game has shown in the
              face of COVID-19 and use it as a force for good.
            </p>
            <p>
              As a not-for-profit  governing  body, we've had to make difficult
              financial decisions to future-proof ourselves from the impact of
              the pandemic, yet with this strategy we are reaffirming our intent
              to shoot for these ambitious goals which, if achieved, will
              improve the health and wellbeing of millions of individuals.
            </p>
            <p>
              Impacting communities, realising the benefits that come with a
              healthier and more engaged population - football can deliver huge
              positive change across the country.
            </p>
            <p>Download the strategy via the related items link below...</p>
          </div>
        </section>
      </section>
      <section className="bottom-bar">
        <img src={footerImg} alt="logo" />
      </section>
      <Dialog
        open={openPinDialog}
        TransitionComponent={Transition}
        onClose={(e) => setDialogVisibility(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <TextField
              autoFocus
              required
              margin="dense"
              name="email"
              id="name"
              onChange={handleChange}
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
        </DialogContent>
      </Dialog>
    </section>
  );
}
