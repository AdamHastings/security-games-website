# import matplotlib.pyplot as plt
# import matplotx
import plotly.express as px
import numpy as np
import pandas as pd
import sys
import copy
import os
import os.path


opacity=0.6

b = '#636EFA'
y = '#FECB52'
r = '#EF553B' 
g = '#00CC96'
k = '#000000'


def plot_p_attacks(df):


    df['p_pairing']                       = df['p_pairing'].apply(lambda x: np.fromstring(x.replace('[','').replace(']',''), dtype=float, sep=','))
    df['p_attacked']                      = df['p_attacked'].apply(lambda x: np.fromstring(x.replace('[','').replace(']',''), dtype=float, sep=','))
    df['p_looted']                        = df['p_looted'].apply(lambda x: np.fromstring(x.replace('[','').replace(']',''), dtype=float, sep=','))
    # df['insurer_estimate_p_pairing']      = df['insurer_estimate_p_pairing'].apply(lambda x: np.fromstring(x.replace('[','').replace(']',''), dtype=float, sep=','))
    # df['estimated_probability_of_attack'] = df['estimated_probability_of_attack'].apply(lambda x: np.fromstring(x.replace('[','').replace(']',''), dtype=float, sep=','))
    df['cumulative_defender_avg_posture'] = df['cumulative_defender_avg_posture'].apply(lambda x: np.fromstring(x.replace('[','').replace(']',''), dtype=float, sep=','))


    # plot p_parings/p_attacks
    # plt.clf()

    attack_ps = [
        ('p_pairing', '% paired', g, '-'),
        ('p_attacked', '% attacked', r, '-'),
        ('p_looted', '% ransomed', k, '-'),
        # ('insurer_estimate_p_pairing', 'I\'s est. p_attack', y, '-'),
        # ('estimated_probability_of_attack', 'D\'s est. p_attack', b, '-'),
        ('cumulative_defender_avg_posture', 'average\nsecurity\nposture', '#0000FF', '-')
    ]

    # with plt.style.context(matplotx.styles.dufte):
    # plt.figure(figsize=(6,4))
    for key, label, color, linestyle in attack_ps:

        length = int(df[key].map(lambda x : len(x)).median())

        means = np.empty([length])
        fifthpct = np.empty([length])
        ninetyfifthpct = np.empty([length])
        for i in range(length):
            col = np.array([x[i] for x in df[key] if i < len(x)])
            means[i] = col.mean()
            fifthpct[i] = np.percentile(col, 5)
            ninetyfifthpct[i] = np.percentile(col, 95)

        # print(label, means)

        x = np.arange(length)
        # too confusing to look at 
        # plt.fill_between(x, fifthpct, ninetyfifthpct, color=color, alpha=0.5, edgecolor='none')
        # fig = px.line(x, means, label=label, color=color, linestyle=linestyle)
        fig = px.line(x=x, y=means)

        # plt.xlabel("timestep")
        # matplotx.ylabel_top("")  # move ylabel to the top, rotate
        # matplotx.line_labels()  # line labels to the right
        # plt.xlim(0, 300)
        # plt.ylim(0, 1.0)
        # fig.set_size_inches(7,3.5)
        # plt.figure(figsize=(7,3))
        # plt.gca().xaxis.grid(True)
        # plt.tight_layout()
        # plt.show()

        basetitle = 'canary_vars_p_attack'
        dirname = 'figures'
        subdirname = df['folder'][0]
        path = dirname + '/' + subdirname 
        # plt.set_xticks(np.arange(0,5000,1000))
        # plt.xticks(np.arange(0,4000,1000))
        
        # if not os.path.isdir(path):
        #     os.mkdir(path)

        # plt.show() # uncomment for zoom in

        # plt.savefig(path + '/' + basetitle + '.png')
        # plt.savefig(path + '/' + basetitle + '.pdf')
        fig.write_html(basetitle + '.html')
        


    

if __name__=="__main__":

    if (len(sys.argv) == 2):
        filename = sys.argv[1]
    else:
        print("Incorrect number of args! Example:")
        print("$ python3 run_all.py <path_to_log_file.csv>")
        sys.exit(1)

    df = pd.read_csv(filename, header=0)
    filename = filename.replace("../logs/", "")
    filename = filename.replace(".csv", "")
    df['folder'] = filename

    plot_p_attacks(copy.deepcopy(df))
    # plot_canary_vars(copy.deepcopy(df))
